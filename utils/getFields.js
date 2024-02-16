import graphqlFields from "graphql-fields"

function getMongooseSelectionFromSelectedFields (info, fieldPath = null) {  
    return Object.keys(graphqlFields(info)).join(' ');
}

export default getMongooseSelectionFromSelectedFields;