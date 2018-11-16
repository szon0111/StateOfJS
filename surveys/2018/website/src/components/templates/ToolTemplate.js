import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Meta from '../elements/Meta'
import Layout from '../common/Layout'
import ToolHeaderBlock from '../blocks/ToolHeaderBlock'
import ToolOpinionsOverTimeBlock from '../blocks/ToolOpinionsOverTimeBlock'
import ReasonsBlock from '../blocks/ReasonsBlock'
import ToolUsageByCountryBlock from '../blocks/ToolUsageByCountryBlock'
import ToolPairingBlock from '../blocks/ToolPairingBlock'
// import SponsorsBlock from '../blocks/SponsorsBlock'
import ResourcesBlock from '../blocks/ResourcesBlock'

const ToolTemplate = ({ pageContext, data }) => {
    // console.log(pageContext, data)

    // this block is skipped if it doesn't appear at least in 2 surveys
    let shouldDisplayExperienceOverTime = false
    if (data.tool.appears_in_surveys.length > 1) {
        shouldDisplayExperienceOverTime = true
    }

    const wouldUseByCountryData = data.tool.would_use_by_country
    const { tool, section } = pageContext
    const projects = data.allProject.edges.map(({ node }) => node)
    return (
        <Layout projects={projects}>
            <div className="template">
                <Meta />
                <ToolHeaderBlock section={section} tool={tool} projects={projects} />
                {shouldDisplayExperienceOverTime ? (
                    <ToolOpinionsOverTimeBlock tool={tool} opinions={data.tool.experience} projects={projects}/>
                ) : (
                    <p className="block tool-over-time-no-data">
                        Sorry, we don&apos;t have enough data to display the evolution of this
                        library's popularity over time.
                    </p>
                )}
                <ReasonsBlock tool={tool} reasons={data.tool.reasons} projects={projects} />
                {/* <SponsorsBlock tool={tool} /> */}
                <ResourcesBlock tool={tool} projects={projects} />
                <ToolPairingBlock tool={tool} data={data.tool.pairing} projects={projects}/>
                <ToolUsageByCountryBlock tool={tool} data={wouldUseByCountryData} projects={projects} />
            </div>
        </Layout>
    )
}

ToolTemplate.propTypes = {
    data: PropTypes.shape({
        tool: PropTypes.shape({
            appears_in_surveys: PropTypes.arrayOf(PropTypes.string).isRequired,
            experience: PropTypes.shape({}).isRequired,
            pairing: PropTypes.arrayOf(
                PropTypes.shape({
                    section: PropTypes.string.isRequired,
                    tools: PropTypes.arrayOf(
                        PropTypes.shape({
                            tool: PropTypes.string.isRequired,
                            score: PropTypes.number.isRequired
                        })
                    ).isRequired
                })
            ).isRequired
        }).isRequired
    }).isRequired
}

export default ToolTemplate

export const query = graphql`
    query toolBySlug($tool: String!) {
        tool: toolsYaml(tool_id: { eq: $tool }) {
            tool_id
            appears_in_surveys
            experience {
                by_survey {
                    survey
                    counts {
                        would_not_use
                        not_interested
                        would_use
                        interested
                        never_heard
                    }
                    percentages {
                        would_not_use
                        not_interested
                        would_use
                        interested
                        never_heard
                    }
                }
            }
            pairing {
                section
                tools {
                    tool
                    total
                    count
                    score
                }
            }
            would_use_by_country {
                survey
                percentage
                buckets {
                    country
                    total
                    count
                    percentage
                    delta_from_average
                }
            }
            reasons {
                like {
                    id
                    count
                }
                dislike {
                    id
                    count
                }
            }
        }
        allProject {
            edges {
                node {
                    id,
                    name,
                    stars,
                    github,
                    description,
                    homepage
                }
            }
        }
    }
`
