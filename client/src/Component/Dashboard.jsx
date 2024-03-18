import React, { useEffect, useState } from 'react'
import axios from "axios"

const Dashboard = () => {

    const [month, setMonth] = useState(3)
    const [search, setSearch] = useState("");
    const [transaction, setTransaction] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [pageData, setpageData] = useState([]);
    const [page, setPage] = useState(1);



    const months = [
        { id: 1, name: "Jan" },
        { id: 2, name: "Feb" },
        { id: 3, name: "Mar" },
        { id: 4, name: "Apr" },
        { id: 5, name: "May" },
        { id: 6, name: "Jun" },
        { id: 7, name: "Jul" },
        { id: 8, name: "Aug" },
        { id: 9, name: "Sep" },
        { id: 10, name: "Oct" },
        { id: 11, name: "Nov" },
        { id: 12, name: "Dec" },

    ];

    // FILTER SEARCH DATA 

    const filterSearch = () => {
        if (!search) {
            return transaction;
        } else {
            return transaction.filter(val =>
                val.title.includes(search) ||
                val.price.toString().includes(search)
            )
        }
    };




    const getData = async () => {
        const res = await axios.get(`http://localhost:6000/api/${month}`)
        console.log(res.data)
        setTransaction(res.data)
    }




    const fetchPageData = async () => {
        try {
            const response = await axios.get(`http://localhost:6000/api/transactions?page=${page}`);
            setpageData(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    

    const handleNextPage = () => {
        setPage(page + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };


    const fetchStatistics = async () => {
        try {
            const response = await axios.get(`http://localhost:6000/api/statistics/${month}`);
            setStatistics(response.data);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        getData()
        fetchPageData();
        fetchStatistics()
    }, [])


    return (
        <>
            <div className="container-fluid">
                <div className="container mt-5">
                    <div className="search d-flex justify-content-between">
                        <input className="p-2" type="text" value={search} placeholder="Search Transaction" onChange={(e) => setSearch(e.target.value)} />
                        <select className="p-2" value={month} onChange={(e) => setMonth(e.target.value)}>
                            {months.map((val) => {
                                return <option key={val.id} value={val.id}>{val.name}</option>
                            })}
                        </select>
                    </div>
                </div>
                <div className="container mt-5">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Title</th>
                                <th scope="col">Price</th>
                                <th scope="col">Category</th>
                                <th scope="col">Sold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterSearch().map(curVal => (
                                <tr key={curVal.id}>
                                    <th scope="row">{curVal.id}</th>
                                    <td>{curVal.title}</td>
                                    <td>{curVal.price}</td>
                                    <td>{curVal.category}</td>
                                    <td>{curVal.sold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='container mt-3 d-flex justify-content-between'>
                    <ul>
                        {pageData.map(val => (
                            <li key={val._id}>{val._id}</li>
                        ))}
                    </ul>
                    <button onClick={handlePrevPage}>Previous</button>
                    <button onClick={handleNextPage}>Next</button>
                </div>

                <div className='container mt-5'>
                    <h2>Statistics for Selected Month</h2>
                    {statistics && (
                        <div>
                            <p>Total Sale: {statistics.totalSaleAmount}</p>
                            <p>TotalSold Items: {statistics.totalSoldItems}</p>
                            <p>TotalNot Sold Items: {statistics.totalNotSoldItems}</p>
                        </div>
                    )}
                </div>
            </div>

        </>
    )
}

export default Dashboard;
