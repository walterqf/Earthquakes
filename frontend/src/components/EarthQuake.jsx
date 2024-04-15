import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Earthquake() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Cambia esto según la cantidad de elementos que quieras mostrar por página

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/earthquakes");
        if (!response.ok) {
          throw new Error("Failed to fetch earthquakes");
        }
        const data = await response.json();
        setEarthquakes(data.data);
      } catch (error) {
        console.error("Error fetching earthquakes:", error);
      }
    };

    fetchEarthquakes();
  }, []);

  const earthquakeDet = (codigoEarth) => {
    //alert(codigoEarth);
    window.location.href = `/earthquake/${codigoEarth}`;
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedEarthquakes = [...earthquakes].sort((a, b) => {
    if (!sortColumn) return 0;
    if (sortColumn === 'time') {
      const dateA = new Date(a.attributes[sortColumn]);
      const dateB = new Date(b.attributes[sortColumn]);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    const valueA = a.attributes[sortColumn];
    const valueB = b.attributes[sortColumn];
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Obtener índices de los elementos a mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedEarthquakes.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const paginate = (pageNumber, event) => {
    event.preventDefault();
    setCurrentPage(pageNumber);
    window.history.pushState(null, null, `/earthquake?page=${pageNumber}%${Math.ceil(sortedEarthquakes.length / itemsPerPage)}`);
  };

  const renderArrow = (column) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  // Función para generar los números de página
  const generatePageNumbers = () => {
    const totalPages = Math.ceil(sortedEarthquakes.length / itemsPerPage);
    const maxVisiblePages = 5; // Cambia este valor según la cantidad de páginas que quieras mostrar
    const delta = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (totalPages <= maxVisiblePages) {
      start = 1;
      end = totalPages;
    } else if (currentPage <= delta) {
      end = maxVisiblePages;
    } else if (currentPage >= totalPages - delta) {
      start = totalPages - maxVisiblePages + 1;
    }

    const pageNumbers = [];
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div>
      <Navbar />
      <div className="pt-5" style={{ minHeight: "100vh" }}>
        <h1 className="text-center">Significant earthquakes</h1>
        <table className="table table-hover">
          <thead>
            <tr className="fs-2 fw-bold text-center">
              <th scope="col" onClick={() => handleSort('title')}>
                Title {renderArrow('title')}
              </th>
              <th scope="col" onClick={() => handleSort('magnitude')}>
                Magnitude {renderArrow('magnitude')}
              </th>
              <th scope="col" onClick={() => handleSort('time')}>
                Time {renderArrow('time')}
              </th>
              <th scope="col" onClick={() => handleSort('place')}>
                Place {renderArrow('place')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((earthquake) => (
              <tr key={earthquake.id} className="table-light">
                <td>
                  <a onClick={() => earthquakeDet(earthquake.id)}>
                    {earthquake.attributes.title}
                  </a>
                </td>
                <td className="text-center">{earthquake.attributes.magnitude}</td>
                <td>{earthquake.attributes.time}</td>
                <td>{earthquake.attributes.place}</td>
                <td>
                  <a href={earthquake.links.external_url}>More info</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Paginación */}
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <a className="page-link" href="#" onClick={(event) => paginate(currentPage - 1, event)}>«</a>
            </li>
            {currentPage !== 1 && (
              <li className="page-item">
                <a className="page-link" href="#" onClick={(event) => paginate(1, event)}>1</a>
              </li>
            )}
            {generatePageNumbers().map((pageNumber) => (
              <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                <a className="page-link" href="#" onClick={(event) => paginate(pageNumber, event)}>{pageNumber}</a>
              </li>
            ))}
            {currentPage !== Math.ceil(sortedEarthquakes.length / itemsPerPage) && (
              <li className="page-item">
                <a className="page-link" href="#" onClick={(event) => paginate(Math.ceil(sortedEarthquakes.length / itemsPerPage), event)}>{Math.ceil(sortedEarthquakes.length / itemsPerPage)}</a>
              </li>
            )}
            <li className={`page-item ${currentPage === Math.ceil(sortedEarthquakes.length / itemsPerPage) ? 'disabled' : ''}`}>
              <a className="page-link" href="#" onClick={(event) => paginate(currentPage + 1, event)}>»</a>
            </li>
          </ul>
        </nav>
      </div>
      <Footer />
    </div>
  );
}

export default Earthquake;
