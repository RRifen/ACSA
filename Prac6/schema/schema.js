const graphql = require('graphql');
const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');

const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema
} = graphql;

const books = [
    {
        id: uuidv4(),
        name: "Путешествие в Элевсин",
        genre: "Роман",
        author_name: "В.О. Пелевин"
    },
    {
        id: uuidv4(),
        name: "Властелин колец",
        genre: "Роман-эпопея",
        author_name: "Дж.Р.Р. Толкиен"
    },
    {
        id: uuidv4(),
        name: "Мастер и Маргарита",
        genre: "Роман",
        author_name: "М.А. Булгаков"
    }
];

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author_name: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        info: {
            type: GraphQLString,
            resolve(parent, args) {
                return "Сервер запущен"
            }
        },
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(books, { id: args.id });
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },
        books_by_name: {
            type: new GraphQLList(BookType),
            args: { name: { type: GraphQLString } },
            resolve(parent, args) {
                return _.filter(books, (o) => {
                    return new RegExp (`.*${args.name}.*`).test(o.name);
                });
            }
        }
    }
});

const Mutations = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
        add_book: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: GraphQLString },
                author_name: { type: GraphQLString }
            },
            resolve(parent, args) {
                if (_.find(books, {name : args.name}) && _.find(books, {author_name : args.author_name})) {
                    return null;
                }
                args.id = uuidv4();
                const arrLength = books.push(args);
                return books[arrLength - 1];
            }
        },
        delete_book: {
            type: BookType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let index = -1;
                for(let i = 0; i < books.length; i++) {
                    if (books[i].id == args.id) {
                        index = i;
                        break;
                    }
                }
                if (index < 0) return null;
                return books.splice(index, 1)[0];
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations
});