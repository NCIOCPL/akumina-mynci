export const formatting = {
    dateFormat: function (dataPublishDate) {
        // Update article published date from "X days ago" to actual date
        const date = new Date(dataPublishDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        return date.toLocaleDateString('en-US', options);
    }
};