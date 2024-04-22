import type { DocumentNode, OperationDefinitionNode, FieldNode } from 'graphql';

export default (query: DocumentNode) => {
  const definition = query.definitions[0] as OperationDefinitionNode;
  const selections = definition.selectionSet.selections[0] as FieldNode;

  return selections.name.value;
};
