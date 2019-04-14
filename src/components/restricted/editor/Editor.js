export function addToCache(cache, query, variables, item) {
    let queryName = query.definitions[0].name.value.toLowerCase();
    let data = cache.readQuery({
        query: query,
        variables: variables
    });

    data[queryName].push(item);
    data[queryName].sort((a, b) => {
        return compare(a, b);
    });

    cache.writeQuery({
        query: query,
        variables: variables,
        data: data
    });
}

export function removeFromCache(cache, query, variables, item) {
    let queryName = query.definitions[0].name.value.toLowerCase();
    let data = cache.readQuery({
        query: query,
        variables: variables
    });

    data[queryName] = data[queryName].filter((e) => compare(e, item) !== 0);

    cache.writeQuery({
        query: query,
        variables: variables,
        data: data
    });
}

export function updateInCache(cache, query, variables, update, item) {
    let queryName = query.definitions[0].name.value.toLowerCase();
    let data = cache.readQuery({
        query: query,
        variables: variables
    });

    if(data[queryName].length) {
        data[queryName].find((e, i) => {
            let found = compare(e, update) === 0;
            if(found)
                data[queryName][i] = item;
            return found;
        });
        data[queryName].sort((a, b) => {
            return compare(a, b);
        });
    } else {
        data = item;
    }

    cache.writeQuery({
        query: query,
        variables: variables,
        data: data
    });
}

export function compare(a, b) {
    if (a.__typename !== b.__typename)
        return false;

    let type = a.__typename;
    switch (type) {
        case "Publisher":
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        case "Series":
            return (a.title.toLowerCase() + a.volume).localeCompare((b.title.toLowerCase() + b.volume));
        case "Issue":
            return a.number.toLowerCase().localeCompare(b.number.toLowerCase());
        default:
            return false;
    }
}