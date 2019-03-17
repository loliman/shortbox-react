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
                    defaultValues.editors = undefined;
                    defaultValues.createdAt = undefined;
                    defaultValues.updatedAt = undefined;
                    defaultValues.cover = defaultValues.cover ? defaultValues.cover : '';

                    let oldStories = [];
                    defaultValues.stories.forEach(story => {
                        oldStories.push({
                            title: story.title,
                            number: story.number,
                            addinfo: story.addinfo,
                            exclusive: story.exclusive,
                            translator: story.exclusive ? undefined : stripItem(story.translators[0]),
                            writer: !story.exclusive ? undefined : stripItem(story.writers[0]),
                            penciler: !story.exclusive ? undefined : stripItem(story.pencilers[0]),
                            inker: !story.exclusive ? undefined : stripItem(story.inkers[0]),
                            colourist: !story.exclusive ? undefined : stripItem(story.colourists[0]),
                            letterer: !story.exclusive ? undefined : stripItem(story.letterers[0]),
                            editor: !story.exclusive ? undefined : stripItem(story.editors[0]),
                            parent: story.exclusive ? undefined : {
                                number: 0,
                                issue: {
                                    series: {
                                        title: story.parent.issue.series.title,
                                        volume: story.parent.issue.series.volume
                                    },
                                    number: story.parent.issue.number
                                }
                            }
                        })
                    });
                    defaultValues.stories = oldStories;

                    let oldFeatures = [];
                    defaultValues.features.forEach(feature => {
                        oldFeatures.push({
                            title: feature.title,
                            number: feature.number,
                            addinfo: feature.addinfo,
                            writer: stripItem(feature.writers[0])
                        })
                    });
                    defaultValues.features = oldFeatures;

                    let oldCovers = [];
                    defaultValues.covers.forEach(cover => {
                        oldCovers.push({
                            number: cover.number,
                            addinfo: cover.addinfo,
                            exclusive: cover.exclusive,
                            artist: !cover.exclusive ? undefined : (cover.artists ? stripItem(cover.artists[0]) : {name: ''}),
                            parent: cover.exclusive ? undefined : {
                                number: 0,
                                issue: {
                                    series: {
                                        title: cover.parent.issue.series.title,
                                        volume: cover.parent.issue.series.volume
                                    },
                                    number: cover.parent.issue.number,
                                    variant: cover.parent.issue.variant
                                }
                            }
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