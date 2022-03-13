class Document {
    /*
     * @param {number} id the id of the document.
     * @param {Map} values a Map object containing fields and values
     */
    constructor(id, values) {
        this.id = id;
        this.values = values;
    }
}

module.exports = Document;
