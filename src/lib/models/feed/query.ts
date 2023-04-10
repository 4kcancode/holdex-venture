import { gql } from '@apollo/client/core'
import { messageFragment } from '../message/query';

export const getFeedMessages = gql`
    query getFeedMessages($feedInput: PostedMessagesConnectionInput!) {
        postedMessages(input: $feedInput) {
            edges {
                node {
                    ...MessageFragment
                    postedIn {
                        node {
                            id
                            name
                            logoUrl
                            slug
                        }
                        messageSlug
                        allReplies(input: {
                            pageInfo: {first: 1}
                            sortBy: CREATED_AT
                            sortDesc: true
                        }) {
                            totalCount 
                        }       
                    }
                }
            }
            pageInfo {
                hasPreviousPage
                hasNextPage
                startCursor
                endCursor

            }
            totalCount
        }
    },
    ${messageFragment}
`;

export const getFeedMessagesForSitemapCursor = gql`
    query getFeedMessagesForSitemapCursor($feedInput: PostedMessagesConnectionInput!) {
        postedMessages(input: $feedInput) {
            pageInfo {
                hasPreviousPage
                hasNextPage
                startCursor
                endCursor

            }
            totalCount
        }
    }
`;

export const getFeedMessagesForSitemapLink = gql`
    query getFeedMessagesForSitemapLink($feedInput: PostedMessagesConnectionInput!) {
        postedMessages(input: $feedInput) {
            edges {
                node {
                    updatedAt
                    postedIn {
                        node {
                            slug
                        }  
                        messageSlug    
                    }
                }
            }
        }
    }
`;
