export function addToCache(cache: any, query: any, variables: any, item: any) {
  let queryName = query.definitions[0].name.value.toLowerCase();
  let data = cache.readQuery({
    query: query,
    variables: variables,
  });

  if (!data || !data[queryName]) return;

  let list = getListRef(data, queryName);
  list.push(item);
  list.sort((a: any, b: any) => {
    return compare(a, b);
  });
  setListRef(data, queryName, list);

  cache.writeQuery({
    query: query,
    variables: variables,
    data: data,
  });
}

export function removeFromCache(cache: any, query: any, variables: any, item: any) {
  let queryName = query.definitions[0].name.value.toLowerCase();
  let data = cache.readQuery({
    query: query,
    variables: variables,
  });

  if (!data || !data[queryName]) return;

  let list = getListRef(data, queryName).filter((e: any) => compare(e, item) !== 0);
  setListRef(data, queryName, list);

  cache.writeQuery({
    query: query,
    variables: variables,
    data: data,
  });
}

export function updateInCache(cache: any, query: any, variables: any, update: any, item: any) {
  let queryName = query.definitions[0].name.value.toLowerCase();
  let data = cache.readQuery({
    query: query,
    variables: variables,
  });

  if (!data || !data[queryName]) return;

  let list = getListRef(data, queryName);

  if (list.length) {
    list.find((e: any, i: any) => {
      let found = compare(e, update) === 0;
      if (found) list[i] = item;
      return found;
    });
    list.sort((a: any, b: any) => {
      return compare(a, b);
    });
    setListRef(data, queryName, list);
  } else {
    setListRef(data, queryName, [item]);
  }

  cache.writeQuery({
    query: query,
    variables: variables,
    data: data,
  });
}

export function compare(a: any, b: any) {
  if (a.__typename !== b.__typename)
    return String(a.__typename || "").localeCompare(String(b.__typename || ""));

  let type = a.__typename;
  switch (type) {
    case "Publisher":
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    case "Series":
      return (a.title.toLowerCase() + a.volume).localeCompare(b.title.toLowerCase() + b.volume);
    case "Issue":
      return (
        `${(a.number || "").toLowerCase()}|${(a.format || "").toLowerCase()}|${(a.variant || "").toLowerCase()}`
      ).localeCompare(
        `${(b.number || "").toLowerCase()}|${(b.format || "").toLowerCase()}|${(b.variant || "").toLowerCase()}`
      );
    default:
      return 0;
  }
}

function getListRef(data: any, queryName: string) {
  const value = data[queryName];
  if (Array.isArray(value)) return value;

  if (value && Array.isArray(value.edges)) return value.edges.map((edge: any) => edge.node);

  return [];
}

function setListRef(data: any, queryName: string, list: any[]) {
  const value = data[queryName];
  if (Array.isArray(value)) {
    data[queryName] = list;
    return;
  }

  if (value && Array.isArray(value.edges)) {
    data[queryName] = {
      ...value,
      edges: list.map((node: any, idx: number) => ({
        cursor: (value.edges[idx] && value.edges[idx].cursor) || String(idx),
        node,
      })),
    };
  }
}
