import gql from "graphql-tag";
import { HierarchyLevel } from "../util/hierarchy";

const search = gql`
  query Nodes($pattern: String!, $us: Boolean!, $offset: Int) {
    nodes(pattern: $pattern, us: $us, offset: $offset) {
      type
      label
      url
    }
  }
`;

const exportQuery = gql`
  query Export($filter: Filter!, $type: String!) {
    export(filter: $filter, type: $type)
  }
`;

const publishers = gql`
  query Publishers($pattern: String, $us: Boolean!, $first: Int, $after: String, $filter: Filter) {
    publishers(pattern: $pattern, us: $us, first: $first, after: $after, filter: $filter) {
      edges {
        node {
          name
          us
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const series = gql`
  query Series(
    $pattern: String
    $publisher: PublisherInput!
    $first: Int
    $after: String
    $filter: Filter
  ) {
    series(
      pattern: $pattern
      publisher: $publisher
      first: $first
      after: $after
      filter: $filter
    ) {
      edges {
        node {
          title
          volume
          startyear
          endyear
          publisher {
            name
            us
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const issues = gql`
  query Issues(
    $pattern: String
    $series: SeriesInput!
    $first: Int
    $after: String
    $filter: Filter
  ) {
    issues(pattern: $pattern, series: $series, first: $first, after: $after, filter: $filter) {
      edges {
        node {
          title
          number
          comicguideid
          collected
          cover {
            url
          }
          covers {
            parent {
              issue {
                cover {
                  url
                }
              }
            }
          }
          series {
            title
            volume
            publisher {
              name
              us
            }
          }
          format
          variants {
            collected
            variant
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const individuals = gql`
  query Individuals($pattern: String, $first: Int, $after: String) {
    individuals(pattern: $pattern, first: $first, after: $after) {
      edges {
        node {
          name
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const apps = gql`
  query Apps($pattern: String, $type: String, $first: Int, $after: String) {
    apps(pattern: $pattern, type: $type, first: $first, after: $after) {
      edges {
        node {
          name
          type
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const arcs = gql`
  query Arcs($pattern: String, $type: String, $first: Int, $after: String) {
    arcs(pattern: $pattern, type: $type, first: $first, after: $after) {
      edges {
        node {
          title
          type
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const lastEdited = gql`
  query LastEdited(
    $filter: Filter
    $first: Int
    $after: String
    $order: String
    $direction: String
  ) {
    lastEdited(
      filter: $filter
      first: $first
      after: $after
      order: $order
      direction: $direction
    ) {
      edges {
        node {
          number
          format
          variant
          verified
          collected
          title
          createdAt
          updatedAt
          comicguideid
          cover {
            url
          }
          covers {
            parent {
              issue {
                cover {
                  url
                }
              }
            }
          }
          series {
            title
            volume
            startyear
            endyear
            publisher {
              name
              us
            }
          }
          covers {
            parent {
              issue {
                cover {
                  url
                }
              }
            }
          }
          stories {
            onlyapp
            firstapp
            onlytb
            exclusive
            otheronlytb
            onlyoneprint
            collectedmultipletimes
            collected
            number
            children {
              issue {
                collected
              }
              number
            }
            reprintOf {
              number
            }
            reprints {
              number
            }
            parent {
              collectedmultipletimes
              collected
              children {
                issue {
                  collected
                }
                number
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const publisher = gql`
  query Publisher($publisher: PublisherInput!) {
    publisher(publisher: $publisher) {
      id
      name
      us
      startyear
      endyear
      seriesCount
      issueCount
      firstIssue {
        number
        format
        variant
        createdAt
        updatedAt
        cover {
          url
        }
        covers {
          parent {
            issue {
              cover {
                url
              }
            }
          }
        }
        comicguideid
        series {
          title
          volume
          startyear
          endyear
          publisher {
            name
            us
          }
        }
        releasedate
        stories {
          onlyapp
          firstapp
          onlytb
          exclusive
          otheronlytb
          onlyoneprint
          collectedmultipletimes
          collected
          number
          children {
            parent {
              collectedmultipletimes
              collected
            }
            issue {
              collected
            }
            number
          }
          reprintOf {
            number
          }
          reprints {
            number
          }
          parent {
            number
            collectedmultipletimes
            collected
            children {
              issue {
                collected
              }
              number
            }
          }
        }
      }
      lastIssue {
        number
        format
        variant
        createdAt
        updatedAt
        cover {
          url
        }
        covers {
          parent {
            issue {
              cover {
                url
              }
            }
          }
        }
        comicguideid
        series {
          title
          volume
          startyear
          endyear
          publisher {
            name
            us
          }
        }
        releasedate
        stories {
          onlyapp
          firstapp
          onlytb
          exclusive
          otheronlytb
          onlyoneprint
          collectedmultipletimes
          collected
          number
          children {
            parent {
              collectedmultipletimes
              collected
            }
            issue {
              collected
            }
            number
          }
          reprintOf {
            number
          }
          reprints {
            number
          }
          parent {
            collectedmultipletimes
            collected
            number
            children {
              issue {
                collected
              }
              number
            }
          }
        }
      }
      active
      addinfo
    }
  }
`;

const seriesd = gql`
  query Seriesd($series: SeriesInput!) {
    seriesd(series: $series) {
      id
      title
      volume
      startyear
      endyear
      issueCount
      firstIssue {
        number
        format
        variant
        createdAt
        updatedAt
        cover {
          url
        }
        covers {
          parent {
            issue {
              cover {
                url
              }
            }
          }
        }
        comicguideid
        series {
          title
          volume
          startyear
          endyear
          publisher {
            name
            us
          }
        }
        releasedate
        stories {
          onlyapp
          firstapp
          onlytb
          exclusive
          otheronlytb
          onlyoneprint
          collectedmultipletimes
          collected
          number
          children {
            parent {
              collectedmultipletimes
              collected
            }
            issue {
              collected
            }
            number
          }
          reprintOf {
            number
          }
          reprints {
            number
          }
          parent {
            collectedmultipletimes
            collected
            number
            children {
              issue {
                collected
              }
              number
            }
          }
        }
      }
      lastIssue {
        number
        format
        variant
        createdAt
        updatedAt
        cover {
          url
        }
        covers {
          parent {
            issue {
              cover {
                url
              }
            }
          }
        }
        comicguideid
        series {
          title
          volume
          startyear
          endyear
          publisher {
            name
            us
          }
        }
        releasedate
        stories {
          onlyapp
          firstapp
          onlytb
          exclusive
          otheronlytb
          onlyoneprint
          collectedmultipletimes
          collected
          number
          children {
            parent {
              collectedmultipletimes
              collected
            }
            issue {
              collected
            }
            number
          }
          reprintOf {
            number
          }
          reprints {
            number
          }
          parent {
            collectedmultipletimes
            collected
            number
            children {
              issue {
                collected
              }
              number
            }
          }
        }
      }
      active
      addinfo
      publisher {
        name
        us
      }
    }
  }
`;

const issue = gql`
  query Issue($issue: IssueInput!, $edit: Boolean) {
    issue(issue: $issue, edit: $edit) {
      id
      title
      isbn
      number
      format
      limitation
      pages
      comicguideid
      releasedate
      price
      currency
      individuals {
        name
        type
      }
      cover {
        url
        individuals {
          name
          type
        }
      }
      covers {
        parent {
          issue {
            cover {
              url
            }
          }
        }
      }
      series {
        title
        volume
        publisher {
          name
          us
        }
      }
      features {
        title
        addinfo
        number
        individuals {
          name
          type
        }
      }
      stories {
        title
        addinfo
        part
        number
        reprints {
          number
          addinfo
          issue {
            cover {
              url
            }
            covers {
              parent {
                issue {
                  cover {
                    url
                  }
                }
              }
            }
            number
            series {
              title
              volume
              startyear
              endyear
              publisher {
                name
                us
              }
            }
            format
            variant
            collected
          }
        }
        children {
          issue {
            collected
          }
          part
          number
          parent {
            issue {
              cover {
                url
              }
              covers {
                parent {
                  issue {
                    cover {
                      url
                    }
                  }
                }
              }
              number
              series {
                title
                volume
                startyear
                endyear
                publisher {
                  name
                  us
                }
              }
              collected
            }
          }
          number
          addinfo
          part
          issue {
            cover {
              url
            }
            covers {
              parent {
                issue {
                  cover {
                    url
                  }
                }
              }
            }
            number
            title
            series {
              title
              volume
              startyear
              endyear
              publisher {
                name
                us
              }
            }
            variant
            collected
          }
        }
        individuals {
          name
          type
        }
        appearances {
          name
          type
          role
        }
        reprintOf {
          title
          number
          issue {
            cover {
              url
            }
            covers {
              parent {
                issue {
                  cover {
                    url
                  }
                }
              }
            }
            number
            series {
              title
              startyear
              endyear
              volume
              publisher {
                name
                us
              }
            }
            collected
          }
        }
        parent {
          title
          number
          collectedmultipletimes
          collected
          reprintOf {
            title
            number
            issue {
              cover {
                url
              }
              covers {
                parent {
                  issue {
                    cover {
                      url
                    }
                  }
                }
              }
              number
              series {
                title
                startyear
                endyear
                volume
                publisher {
                  name
                  us
                }
              }
              collected
            }
          }
          issue {
            cover {
              url
            }
            covers {
              parent {
                issue {
                  cover {
                    url
                  }
                }
              }
            }
            number
            series {
              title
              startyear
              endyear
              volume
              publisher {
                name
                us
              }
            }
            format
            variant
            stories {
              number
              children {
                issue {
                  collected
                }
                number
              }
            }
            arcs {
              title
              type
            }
            collected
          }
          individuals {
            name
            type
          }
          appearances {
            name
            type
            role
          }
        }
        onlyapp
        firstapp
        otheronlytb
        onlytb
        onlyoneprint
        collectedmultipletimes
        collected
        exclusive
      }
      covers {
        url
        addinfo
        number
        children {
          issue {
            cover {
              url
            }
            covers {
              parent {
                issue {
                  cover {
                    url
                  }
                }
              }
            }
            collected
          }
          number
          addinfo
          issue {
            cover {
              url
            }
            covers {
              parent {
                issue {
                  cover {
                    url
                  }
                }
              }
            }
            number
            format
            variant
            collected
            series {
              title
              volume
              startyear
              endyear
              publisher {
                name
                us
              }
            }
          }
        }
        parent {
          issue {
            cover {
              url
            }
            covers {
              parent {
                issue {
                  cover {
                    url
                  }
                }
              }
            }
            variant
            format
            number
            collected
            series {
              title
              startyear
              endyear
              volume
              publisher {
                name
                us
              }
            }
          }
          individuals {
            name
            type
          }
        }
        onlyapp
        firstapp
        exclusive
        individuals {
          name
          type
        }
      }
      variants {
        covers {
          parent {
            issue {
              cover {
                url
              }
              covers {
                parent {
                  issue {
                    cover {
                      url
                    }
                  }
                }
              }
            }
          }
        }
        stories {
          number
        }
        format
        variant
        number
        comicguideid
        collected
        series {
          title
          volume
          publisher {
            name
            us
          }
        }
        cover {
          url
        }
        covers {
          parent {
            issue {
              cover {
                url
              }
            }
          }
        }
      }
      arcs {
        title
        type
      }
      variant
      verified
      collected
      addinfo
    }
  }
`;

function getListQuery(level: string) {
  switch (level) {
    case HierarchyLevel.ROOT:
      return publishers;
    case HierarchyLevel.PUBLISHER:
      return series;
    default:
      return issues;
  }
}

export {
  getListQuery,
  publisher,
  seriesd,
  issue,
  search,
  publishers,
  series,
  issues,
  individuals,
  apps,
  arcs,
  exportQuery,
};
