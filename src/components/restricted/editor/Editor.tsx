export function addToCache(cache, query, variables, item) {
  let queryName = query.definitions[0].name.value.toLowerCase();
  let data = cache.readQuery({
    query: query,
    variables: variables,
  });

  if (!data || !data[queryName]) return;

  let list = getListRef(data, queryName);
  list.push(item);
  list.sort((a, b) => {
    return compare(a, b);
  });
  setListRef(data, queryName, list);

  cache.writeQuery({
    query: query,
    variables: variables,
    data: data,
  });
}

export function removeFromCache(cache, query, variables, item) {
  let queryName = query.definitions[0].name.value.toLowerCase();
  let data = cache.readQuery({
    query: query,
    variables: variables,
  });

  if (!data || !data[queryName]) return;

  let list = getListRef(data, queryName).filter((e) => compare(e, item) !== 0);
  setListRef(data, queryName, list);

  cache.writeQuery({
    query: query,
    variables: variables,
    data: data,
  });
}

export function updateInCache(cache, query, variables, update, item) {
  let queryName = query.definitions[0].name.value.toLowerCase();
  let data = cache.readQuery({
    query: query,
    variables: variables,
  });

  if (!data || !data[queryName]) return;

  let list = getListRef(data, queryName);

  if (list.length) {
    list.find((e, i) => {
      let found = compare(e, update) === 0;
      if (found) list[i] = item;
      return found;
    });
    list.sort((a, b) => {
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

export function compare(a, b) {
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

function getListRef(data, queryName) {
  const value = data[queryName];
  if (Array.isArray(value)) return value;

  if (value && Array.isArray(value.edges)) return value.edges.map((edge) => edge.node);

  return [];
}

function setListRef(data, queryName, list) {
  const value = data[queryName];
  if (Array.isArray(value)) {
    data[queryName] = list;
    return;
  }

  if (value && Array.isArray(value.edges)) {
    data[queryName] = {
      ...value,
      edges: list.map((node, idx) => ({
        cursor: (value.edges[idx] && value.edges[idx].cursor) || String(idx),
        node,
      })),
    };
  }
}
