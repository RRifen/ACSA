get_books();

let book_form = document.getElementById("book_form_add");

book_form.addEventListener("submit", (e) => {
    e.preventDefault();

    let book_name = document.getElementById("book_name_add").value;
    let book_genre = document.getElementById("book_genre_add").value;
    let book_author = document.getElementById("book_author_add").value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
        query: `mutation {\r\n    add_book (\r\n        name: \"${book_name}\"\r\n        genre: \"${book_genre}\"\r\n        author_name: \"${book_author}\"\r\n    )\r\n    {\r\n        id\r\n        name\r\n        genre\r\n        author_name\r\n    }\r\n}`,
        variables: {}
    })
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow'
    };

    fetch("http://localhost:1234/graphql", requestOptions)
        .then(response => response.json())
        .then(result => {
            const table = document.getElementById('books_table_body');
            result = result['data']['add_book'];
            let row = document.createElement('tr');
            appendColumn(row, result.id);
            appendColumn(row, result.name);
            appendColumn(row, result.genre);
            appendColumn(row, result.author_name);
            table.appendChild(row);
            console.log(result)
        })
        .catch(error => console.log('error', error));

});

book_form = document.getElementById("book_form_delete");

book_form.addEventListener("submit", (e) => {
    e.preventDefault();

    let book_id = document.getElementById("book_id_delete").value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
        query: `mutation {\r\n    delete_book (\r\n        id: \"${book_id}\"\r\n    )\r\n    {\r\n        id\r\n    }\r\n}`,
        variables: {}
    })
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow'
    };

    fetch("http://localhost:1234/graphql", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

    location.reload();

});

book_form = document.getElementById("book_form_search");

book_form.addEventListener("submit", (e) => {
    e.preventDefault();

    let book_name = document.getElementById("book_name_search").value;

    get_books_by_name(book_name);

});

async function get_books() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
        query: "{\r\n    books {\r\n        id\r\nname\r\ngenre\r\nauthor_name\r\n}\r\n}",
        variables: {}
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow'
    };

    let data = await fetch("http://localhost:1234/graphql/", requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
    data = data['data']['books'];
    const table = document.getElementById('books_table_body');
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        let row = document.createElement('tr');
        appendColumn(row, data[i].id);
        appendColumn(row, data[i].name);
        appendColumn(row, data[i].genre);
        appendColumn(row, data[i].author_name);
        table.appendChild(row);
    }
}

function appendColumn(row, data) {
    let td = document.createElement('td');
    td.appendChild(
        document.createTextNode(data)
    );
    row.appendChild(td);
}

async function get_books_by_name(book_name) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
        query: `{\r\n    books_by_name(name: \"${book_name}\") {\r\n        id\r\n        name\r\n        genre\r\n        author_name\r\n    }\r\n}`,
        variables: {}
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow'
    };
    let data = await fetch("http://localhost:1234/graphql/", requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
    const table = document.getElementById('books_table_search');
    table.innerHTML = '';
    data = data['data']['books_by_name'];
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        let row = document.createElement('tr');
        appendColumn(row, data[i].id);
        appendColumn(row, data[i].name);
        appendColumn(row, data[i].genre);
        appendColumn(row, data[i].author_name);
        table.appendChild(row);
    }
}