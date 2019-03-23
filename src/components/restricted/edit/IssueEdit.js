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
                        return <QueryResult loading={loading} error={error} data={data.issue} selected={selected}/>;

                    let defaultValues = JSON.parse(JSON.stringify(data.issue));

                    defaultValues.variants = undefined;
                    defaultValues.verified = undefined;
                    defaultValues.createdAt = undefined;
                    defaultValues.updatedAt = undefined;
                    defaultValues.cover = defaultValues.cover ? defaultValues.cover : '';
                    defaultValues.editors = (defaultValues.editors && defaultValues.editors.length > 0 ? defaultValues.editors.map(individual => stripItem(individual)) : []);
                    defaultValues.pages = defaultValues.pages ? defaultValues.pages : 0;
                    defaultValues.limitation = defaultValues.limitation ? defaultValues.limitation : 0;

                    let oldStories = [];
                    defaultValues.stories.forEach(story => {
                        let exclusive = story.exclusive || defaultValues.series.publisher.us;

                        oldStories.push({
                            title: story.title,
                            number: story.number,
                            addinfo: story.addinfo,
                            exclusive: exclusive,
                            translators: exclusive ? undefined : (story.translators && story.translators.length > 0 ? story.translators.map(individual => stripItem(individual)) : []),
                            writers: !exclusive ? undefined : (story.writers && story.writers.length > 0 ? story.writers.map(individual => stripItem(individual)) : []),
                            pencilers: !exclusive ? undefined : (story.pencilers && story.pencilers.length > 0 ? story.pencilers.map(individual => stripItem(individual)) : []),
                            inkers: !exclusive ? undefined : (story.inkers && story.inkers.length > 0 ? story.inkers.map(individual => stripItem(individual)) : []),
                            colourists: !exclusive ? undefined : (story.colourists && story.colourists.length > 0 ? story.colourists.map(individual => stripItem(individual)) : []),
                            letterers: !exclusive ? undefined : (story.letterers && story.letterers.length > 0 ? story.letterers.map(individual => stripItem(individual)) : []),
                            editors: !exclusive ? undefined : (story.editors && story.editors.length > 0 ? story.editors.map(individual => stripItem(individual)) : []),
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
                            writers: (feature.writers && feature.writers.length > 0 ? feature.writers.map(individual => stripItem(individual)) : [])
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
                            artists: !exclusive ? undefined : (cover.artists && cover.artists.length > 0 ? cover.artists.map(individual => stripItem(individual)) : []),
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