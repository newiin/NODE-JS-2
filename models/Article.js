const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAlgolia = require('mongoose-algolia');
const Schema = mongoose.Schema;
const ArticleSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'subcategories'
    },
    writter: {

    },
    title: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },

    isAccepted: {
        type: Boolean,
        default: false
    },

    image: {
        type: String,
    },
    prime: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now(),
    }

});
ArticleSchema.plugin(mongooseAlgolia, {
    appId: 'NDZD544N8P',
    apiKey: '180ca04461c7ed92b1a90d8faa953193',
    indexName: 'ArticleSchema', //The name of the index in Algolia, you can also pass in a function
    selector: 'title body category.name category.category.name ' , //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
    populate: {
        path: 'category',
        select:'name',
            populate: {
                path: 'category',
                select:'name',
            }
    },
    defaults: {
        author: 'unknown'
    },
    mappings: {
        // title: function (value) {
        //     return `Title: ${value}`
        // }
    },
    virtuals: {
        whatever: function (doc) {
            return `Custom data ${doc.title}`
        }
    },
    filter: function (doc) {
        return !doc.softdelete
    },
    debug: true // Default: false -> If true operations are logged out in your console
});
ArticleSchema.plugin(timestamps);
ArticleSchema.plugin(mongoosePaginate);
let Model = mongoose.model('articles', ArticleSchema);

Model.SyncToAlgolia(); //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)
Model.SetAlgoliaSettings({
    searchableAttributes: ['title', 'body','category.name' ,'category.category.name','shows'] //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
})

module.exports = Model;