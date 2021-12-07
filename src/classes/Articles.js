export default class Articles {
    constructor(title, image, imageCaption, category, author, date, content) {
        this.title = '=' + title; // = filters search strictly by category
        this.image = image;
        this.imageCaption = imageCaption;
        this.category = '_' + category; // _ filters search strictly by category
        this.author = '$' + author; // $ filters search strictly by author
        this.date = date;
        this.content = '^' + this.parsedContent(content); //  ^ filters search strictly by category
        this.saved = false;
        this.dateScore = this.dateScore(date);
    }
    dateScore(date) {
        let months = ['placeholder', 'January', 'February', 
        'March', 'April', 'May', 'June', 'July', 'August', 
        'September','October', 'November', 'December'];
    
        let parsedDate = date.split(' ');
        let strMonth = String(months.findIndex(num => num === parsedDate[0]));
        if (strMonth.length === 1) strMonth = '0' + strMonth;
        let strDay = parsedDate[1].substring(0, parsedDate[1].length - 1);
        if (strDay.length === 1) strDay = '0' + strDay;
        let dateScore = parsedDate[2] + strMonth + strDay;
        return parseInt(dateScore);          
    }
    parsedContent(content) {
        content = [...content]
        while (content.includes('~')) {
            let replaceIndex = content.findIndex(num => num === '~');
            content[replaceIndex] = '\n\n\n';
        }
        return content.join('');
    }
}