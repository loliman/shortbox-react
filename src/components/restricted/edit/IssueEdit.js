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
                    defaultValues.editor = (defaultValues.editors && defaultValues.editors.length > 0 ? stripItem(defaultValues.editors[0]) : {name: ''});
                    defaultValues.pages = defaultValues.pages ? defaultValues.pages : 0;
                    defaultValues.limitation = defaultValues.limitation ? defaultValues.limitation : 0;
                    defaultValues.editors = undefined;

                    let oldStories = [];
                    defaultValues.stories.forEach(story => {
                        let exclusive = story.exclusive || defaultValues.series.publisher.us;

                        oldStories.push({
                            title: story.title,
                            number: story.number,
                            addinfo: story.addinfo,
                            exclusive: exclusive,
                            translator: exclusive ? undefined : (story.translators && story.translators.length > 0 ? stripItem(story.translators[0]) : {name: ''}),
                            writer: !exclusive ? undefined : (story.writers && story.writers.length > 0 ? stripItem(story.writers[0]) : {name: ''}),
                            penciler: !exclusive ? undefined : (story.pencilers && story.pencilers.length > 0 ? stripItem(story.pencilers[0]) : {name: ''}),
                            inker: !exclusive ? undefined : (story.inkers && story.inkers.length > 0 ? stripItem(story.inkers[0]) : {name: ''}),
                            colourist: !exclusive ? undefined : (story.colourists && story.colourists.length > 0 ? stripItem(story.colourists[0]) : {name: ''}),
                            letterer: !exclusive ? undefined : (story.letterers && story.letterers.length > 0 ? stripItem(story.letterers[0]) : {name: ''}),
                            editor: !exclusive ? undefined : (story.editors && story.editors.length > 0 ? stripItem(story.editors[0]) : {name: ''}),
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
                            writer: (feature.writers && feature.writers.length > 0 ? stripItem(feature.writers[0]) : {name: ''})
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
                            artist: !exclusive ? undefined : (cover.artists && cover.artists.length > 0 ? stripItem(cover.artists[0]) : {name: ''}),
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