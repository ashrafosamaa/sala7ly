import { paginationFunction } from "./pagination.js"

export class APIFeatures {
    constructor(query, mongooseQuery) {
        this.query = query 
        this.mongooseQuery = mongooseQuery
    }
    pagination({ page, size }) {
    //  Get all products paginated 
        const { limit, skip } = paginationFunction({ page, size })  
        this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip)
        return this
    }
    sort(sortBy) {
        if (!sortBy) {
            this.mongooseQuery = this.mongooseQuery.sort({ createdAt: -1 })
            return this
        }
        const formula = sortBy.replace(/desc/g, -1).replace(/asc/g, 1).replace(/ /g, ':') 
        const [key, value] = formula.split(':')
        this.mongooseQuery = this.mongooseQuery.sort({ [key]: +value })
        return this
    }
    //  Search on user with any field
    searchUsers(search) {
        const queryFiler = {}
        
        if (search.firstName) queryFiler.firstName = { $regex: search.firstName, $options: 'i' }
        if (search.lastName) queryFiler.lastName = { $regex: search.lastName, $options: 'i' }
        if (search.email) queryFiler.email = { $regex: search.email, $options: 'i' }
        if (search.phoneNumber) queryFiler.phoneNumber = { $regex: search.phoneNumber, $options: 'i' }

        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }
    
    //  Search on category , style , subject with any field
    searchCategories(search) {
        const queryFiler = {}

        if (search.title) queryFiler.title = { $regex: search.title, $options: 'i' }
        if (search.slug) queryFiler.slug = { $regex: search.slug, $options: 'i' }

        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }
    //   Search on product with any field
    searchProduct(search) {
        const queryFiler = {}

        if (search.title) queryFiler.title = { $regex: search.title, $options: 'i' }
        if (search.material) queryFiler.material = { $regex: search.material, $options: 'i' }
        if (search.slug) queryFiler.slug = { $regex: search.slug, $options: 'i' }
        if (search.size) queryFiler.size = { $regex: search.size, $options: 'i' }
        if (search.appliedPrice) queryFiler.appliedPrice = { $in: search.appliedPrice }
        if (search.discount) queryFiler.discount = { $in: search.discount }
        if (search.priceFrom && !search.priceTo) queryFiler.appliedPrice = { $gte: search.priceFrom }
        if (search.priceTo && !search.priceFrom) queryFiler.appliedPrice = { $lte: search.priceTo }
        if (search.priceTo && search.priceFrom) queryFiler.appliedPrice = { $gte: search.priceFrom, $lte: search.priceTo }
        if (search.height) queryFiler.height = { $in: search.height }
        if (search.width) queryFiler.width = { $in: search.width }
        if (search.depth) queryFiler.depth = { $in: search.depth }
        if (search.isAvailable) queryFiler.isAvailable = { $in: search.isAvailable }
        if (search.artistId ) queryFiler.artistId = { $in: search.artistId }

        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }
    //   Search on event with any field
    searchEvents(search) {
        const queryFiler = {}

        if (search.title) queryFiler.title = { $regex: search.title, $options: 'i' }
        if (search.description) queryFiler.description = { $regex: search.description, $options: 'i' }
        if (search.artistId ) queryFiler.artistId = { $in: search.artistId }

        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }
    //   Search on event with any field
    filterEventsTime(search) {
        const queryFiler = {}

        if (search.dateFrom && !search.dateTo) queryFiler.startAt = { $gte: search.dateFrom }
        if (search.dateTo && !search.dateFrom) queryFiler.endAt = { $gte: search.dateTo }
        if (search.dateTo && search.dateFrom) {
            queryFiler.startAt = { $gte: search.dateFrom }
            queryFiler.endAt = { $gte: search.dateTo }
        }
        if(search.duration) queryFiler.duration = { $in: search.duration }

        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }
    filterProducts(search){
        const queryFiler = {}

        if (search.categoryId ) queryFiler.categoryId = { $in: search.categoryId }
        if (search.styleId ) queryFiler.styleId = { $in: search.styleId }
        if (search.subjectId ) queryFiler.subjectId = { $in: search.subjectId }

        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }
    filter(filters) {
        const queryFilter = JSON.parse(
            JSON.stringify(filters).replace(
                /gt|gte|lt|lte|in|nin|eq|ne|regex/g,
                (operator) => `$${operator}`,
            ),
        )
        this.mongooseQuery.find(queryFilter)
        return this
    }
}