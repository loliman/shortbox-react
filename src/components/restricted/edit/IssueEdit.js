import React from 'react'
import Layout from "../../Layout";
import {Query} from "react-apollo";
import {editIssue} from "../../../graphql/mutations";
import {issue} from "../../../graphql/queries";
import {withContext} from "../../generic";
import QueryResult from "../../generic/QueryResult";
import IssueEditor from "../editor/IssueEditor";
import {stripItem} from "../../../util/util";

function IssueEdit(props) {
    const {selected} = props;
    let variables = selected;
    variables.edit = true;

    return (
        <Layout>
            <Query query={issue} variables={variables}>
                {({loading, error, data}) => {
                    if (loading || error || !data.issue)
                        return <QueryResult loading={loading} error={error} data={data ? data.issue : null} selected={selected}/>;

                    let defaultValues = JSON.parse(JSON.stringify(data.issue));

                    defaultValues.variants = undefined;
                    defaultValues.verified = undefined;
                    defaultValues.createdAt = undefined;
                    defaultValues.updatedAt = undefined;
                    defaultValues.cover = defaultValues.cover ? defaultValues.cover : '';
                    defaultValues.individuals = defaultValues.individuals ? defaultValues.individuals.map(i => stripItem(i)) : [];
                    defaultValues.pages = defaultValues.pages ? defaultValues.pages : 0;
                    defaultValues.limitation = defaultValues.limitation ? defaultValues.limitation : 0;

                    let oldArcs = [];
                    defaultValues.arcs.forEach(arc => {
                        oldArcs.push({
                            title: arc.title,
                            type: arc.type
                        })
                    });
                    defaultValues.arcs = oldArcs;

                    let oldStories = [];
                    defaultValues.stories.forEach(story => {
                        let exclusive = story.exclusive || defaultValues.series.publisher.us;

                        oldStories.push({
                            title: story.title,
                            number: story.number,
                            addinfo: story.addinfo,
                            exclusive: exclusive,
                            individuals: !exclusive ? undefined : (story.individuals ? story.individuals.map(i => stripItem(i)) : []),
                            parent: exclusive ? undefined : {
                                number: story.parent.number,
                                issue: {
                                    series: {
                                        title: story.parent.issue.series.title,
                                        volume: story.parent.issue.series.volume
                                    },
                                    number: story.parent.issue.number
                                }
                            },
                            children: story.children
                        })
                    });
                    defaultValues.stories = oldStories;

                    let oldFeatures = [];
                    defaultValues.features.forEach(feature => {
                        oldFeatures.push({
                            title: feature.title,
                            number: feature.number,
                            addinfo: feature.addinfo,
                            individuals: (feature.individuals ? feature.individuals.map(i => stripItem(i)) : [])
                        })
                    });
                    defaultValues.features = oldFeatures;

                    let oldCovers = [];
                    defaultValues.covers.forEach(cover => {
                        let exclusive = cover.exclusive || defaultValues.series.publisher.us;

                        oldCovers.push({
                            number: cover.number,
                            addinfo: cover.addinfo,
                            exclusive: exclusive,
                            individuals: !exclusive ? undefined : (cover.individuals ? cover.individuals.map(i => stripItem(i)) : []),
                            parent: exclusive ? undefined : {
                                number: 0,
                                issue: {
                                    series: {
                                        title: cover.parent.issue.series.title,
                                        volume: cover.parent.issue.series.volume
                                    },
                                    number: cover.parent.issue.number,
                                    variant: cover.parent.issue.variant
                                }
                            },
                            children: cover.children
                        })
                    });
                    defaultValues.covers = oldCovers;

                    return (
                        <IssueEditor edit
                                     mutation={editIssue}
                                     defaultValues={defaultValues}
                        />
                    );
                }}
            </Query>
        </Layout>
    )
}

export default withContext(IssueEdit);
