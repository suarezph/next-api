import type { NextApiRequest } from 'next';

export interface WithUserApiRequest extends NextApiRequest {
  user: { id: string; email: string; role: string };
}

// Overriding
type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export type MyCustomRequest = Override<
  NextApiRequest,
  { body: MyCustomRequestBody }
>;

export type MyCustomRequestBody = {
  myCustomField: string;
};
