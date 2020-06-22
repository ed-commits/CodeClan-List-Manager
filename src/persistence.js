
const Persistence = function () {
    this.array = [];
    if (localStorage.array !== null) {
        this.load(localStorage.array);
    }
}

Persistence.prototype.save = function() {
    localStorage.array = JSON.stringify(this.array);
}

Persistence.prototype.load = function(text) {
//    console.log(text);
    try {
        this.array = JSON.parse(text);
    }
    catch (error) { }
}

Persistence.prototype.clear = function() {
    this.array = [];
    localStorage.removeItem('array');
}

Persistence.prototype.delete_by_id = function(id) {
    this.array = this.array.filter(obj => obj.id !== id);
    this.save();
}

Persistence.prototype.update_by_id = function(id, text) {
    const index = this.array.findIndex(obj => obj.id == id);
    this.array[index].details = text;
    this.save();
}

module.exports = Persistence;
