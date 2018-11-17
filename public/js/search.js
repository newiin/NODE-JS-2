var client = algoliasearch('NDZD544N8P', '4fc34898026b2541b6c33a7b7d97ef9c');
var index = client.initIndex('ArticleSchema');
//initialize autocomplete on search input (ID selector must match)
autocomplete('#aa-search-input',
{ hint: false }, {
    source: autocomplete.sources.hits(index, {hitsPerPage: 15}),
    //value to be displayed in input control after user's suggestion selection
    displayKey: 'name',
    //hash of templates used when rendering dataset
    templates: {
        //'suggestion' templating function used to render a single suggestion
        suggestion: function(suggestion) {
          return '<a href="/article/'+suggestion.objectID+'/details"><span>' +
            suggestion._highlightResult.title.value + '</span><a/>';
        }
    }
});