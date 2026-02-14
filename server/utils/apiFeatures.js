class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;      // MongoDB query (e.g., Product.find())
        this.queryStr = queryStr; // URL ke parameters (e.g., req.query)
    }

    // 1: Search Logic (Keyword based)
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword, // Naam dhoondne ke liye
                $options: "i", // Case insensitive (Choty baray harf ka farq nahi)
            }
        } : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    // 2: Filter Logic (Category, Price, Ratings)
    filter() {
        const queryCopy = { ...this.queryStr };

        // In fields ko hum filtering se nikal denge kiyunke ye alag handle hoti hain
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(key => delete queryCopy[key]);

        // Price aur Ratings ke liye (Greater than / Less than) logic
        // URL me 'price[gte]=100' hota hy, humein '$gte' chahiye
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    // 3: Pagination Logic
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1); // Kitni items skip karni hain

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

export default ApiFeatures;