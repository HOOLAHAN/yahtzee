import { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { BatchWriteItemCommand, DynamoDBClient, GetItemCommand, ScanCommand, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';

const db = new DynamoDBClient({});
const cognito = new CognitoIdentityProviderClient({});
const table = process.env.PROFILE_TABLE;
const pool = process.env.USER_POOL_ID;
const scoreTable = process.env.SCORE_TABLE;
const s = (value) => ({ S: value });
const clean = (value, max = 50) => String(value ?? '').trim().slice(0, max);
const normalise = (value) => clean(value, 20).toLowerCase();
const profileKey = (sub) => `USER#${sub}`;
const usernameKey = (name) => `USERNAME#${normalise(name)}`;

async function getProfile(sub) {
  const result = await db.send(new GetItemCommand({
    TableName: table,
    Key: { pk: s(profileKey(sub)) },
    ConsistentRead: true,
  }));
  const item = result.Item;
  return item ? {
    userId: sub,
    username: item.username.S,
    firstName: item.firstName?.S ?? '',
    lastName: item.lastName?.S ?? '',
  } : null;
}

async function writeAll(requestItems) {
  let pending = requestItems;
  do {
    const result = await db.send(new BatchWriteItemCommand({ RequestItems: pending }));
    pending = result.UnprocessedItems ?? {};
  } while (Object.values(pending).some((requests) => requests.length));
}

async function renameScores(sub, username) {
  if (!scoreTable) return;
  let startKey;
  do {
    const result = await db.send(new ScanCommand({
      TableName: scoreTable,
      FilterExpression: 'userId = :sub',
      ExpressionAttributeValues: { ':sub': s(sub) },
      ExclusiveStartKey: startKey,
    }));
    const items = (result.Items ?? []).map((item) => ({ ...item, username: s(username) }));
    for (let index = 0; index < items.length; index += 25) {
      await writeAll({
        [scoreTable]: items.slice(index, index + 25).map((item) => ({ PutRequest: { Item: item } })),
      });
    }
    startKey = result.LastEvaluatedKey;
  } while (startKey);
}

async function deleteScores(sub) {
  if (!scoreTable) return;
  let startKey;
  do {
    const result = await db.send(new ScanCommand({
      TableName: scoreTable,
      FilterExpression: 'userId = :sub',
      ExpressionAttributeValues: { ':sub': s(sub) },
      ProjectionExpression: 'id',
      ExclusiveStartKey: startKey,
    }));
    const ids = (result.Items ?? []).map((item) => item.id).filter(Boolean);
    for (let index = 0; index < ids.length; index += 25) {
      await writeAll({
        [scoreTable]: ids.slice(index, index + 25).map((id) => ({ DeleteRequest: { Key: { id } } })),
      });
    }
    startKey = result.LastEvaluatedKey;
  } while (startKey);
}

export const handler = async (event) => {
  const field = event.field;
  if (field === 'usernameAvailable') {
    const username = clean(event.args.username, 20);
    if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) return false;
    const result = await db.send(new GetItemCommand({
      TableName: table,
      Key: { pk: s(usernameKey(username)) },
      ConsistentRead: true,
    }));
    return !result.Item;
  }

  const claims = event.identity?.claims;
  const sub = claims?.sub;
  if (!sub) throw new Error('Authentication required');
  if (field === 'myProfile') {
    return await getProfile(sub) ?? {
      userId: sub,
      username: claims.preferred_username ?? '',
      firstName: claims.given_name ?? '',
      lastName: claims.family_name ?? '',
    };
  }
  if (field === 'deleteMyProfile') {
    const current = await getProfile(sub);
    await deleteScores(sub);
    if (current) {
      await db.send(new TransactWriteItemsCommand({ TransactItems: [
        { Delete: { TableName: table, Key: { pk: s(profileKey(sub)) } } },
        { Delete: {
          TableName: table,
          Key: { pk: s(usernameKey(current.username)) },
          ConditionExpression: 'userId = :sub',
          ExpressionAttributeValues: { ':sub': s(sub) },
        } },
      ] }));
    }
    return true;
  }
  if (field !== 'updateMyProfile') throw new Error('Unsupported operation');

  const username = clean(event.args.username, 20);
  const firstName = clean(event.args.firstName);
  const lastName = clean(event.args.lastName);
  if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) throw new Error('Username must be 3–20 letters, numbers or underscores.');
  if (!firstName || !lastName) throw new Error('First name and surname are required.');

  const current = await getProfile(sub);
  const items = [
    { Put: {
      TableName: table,
      Item: { pk: s(usernameKey(username)), userId: s(sub) },
      ConditionExpression: 'attribute_not_exists(pk) OR userId = :sub',
      ExpressionAttributeValues: { ':sub': s(sub) },
    } },
    { Put: { TableName: table, Item: {
      pk: s(profileKey(sub)), userId: s(sub), username: s(username),
      usernameNormalised: s(normalise(username)), firstName: s(firstName), lastName: s(lastName),
    } } },
  ];
  if (current && normalise(current.username) !== normalise(username)) {
    items.push({ Delete: {
      TableName: table,
      Key: { pk: s(usernameKey(current.username)) },
      ConditionExpression: 'userId = :sub',
      ExpressionAttributeValues: { ':sub': s(sub) },
    } });
  }
  try {
    await db.send(new TransactWriteItemsCommand({ TransactItems: items }));
  } catch (error) {
    if (error.name === 'TransactionCanceledException') throw new Error('That username is already taken.');
    throw error;
  }

  await cognito.send(new AdminUpdateUserAttributesCommand({
    UserPoolId: pool,
    Username: claims['cognito:username'],
    UserAttributes: [
      { Name: 'preferred_username', Value: username },
      { Name: 'given_name', Value: firstName },
      { Name: 'family_name', Value: lastName },
    ],
  }));

  if (!current || current.username !== username) await renameScores(sub, username);
  return { userId: sub, username, firstName, lastName };
};
