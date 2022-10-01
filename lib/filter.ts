export type Query = {
  page?: string;
  limit?: string;
  sort?: string;
};

function pagination({
  page,
  limit,
  defaultLimit = 25,
}: {
  page: number;
  limit: number;
  defaultLimit?: number;
}) {
  return {
    take: limit ? limit : defaultLimit,
    skip: page && page !== 1 ? page * limit - limit : 0,
  };
}

function order(sort: string) {
  if (!sort) return { orderBy: [] };

  return {
    orderBy: sort
      .split(',')
      .reduce((acc: { [key: string]: string }[], item: string) => {
        if (item.includes('-')) {
          return [...acc, { [item.replace('-', '')]: 'desc' }];
        }

        return [...acc, { [item]: 'asc' }];
      }, []),
  };
}

export { pagination, order };
