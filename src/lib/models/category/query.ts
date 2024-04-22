import { gql } from '@apollo/client/core';
import { messageFragment } from '../message/query';

export const getCategoryBySlug = gql`
  query getCategoryBySlug($category: String!, $feedInput: CommunityPostedMessagesConnectionInput!) {
    community(slug: $category) {
      id
      slug
      name
      published
      tagline
      logoUrl
      externalLinks {
        type
        url
      }
      hashtags(input: { pageInfo: { first: 25 } }) {
        edges {
          node {
            id
            postedMessagesTotalCount
          }
        }
        totalCount
      }
      postedMessages(input: $feedInput) {
        edges {
          node {
            ...MessageFragment
            postedIn {
              node {
                id
                slug
              }
              messageSlug
              allReplies(input: { pageInfo: { first: 1 }, sortBy: CREATED_AT, sortDesc: true }) {
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
    }
  }
  ${messageFragment}
`;
