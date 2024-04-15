import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const EarthquakeDetail = () => {
  const { id } = useParams();
  const [earthquake, setEarthquake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({
    feature_id: id,
    body: "",
  });
  const [showDiv, setShowDiv] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [commenteditedId, setCommenteditedId] = useState(0);

  // Manejador de eventos para el clic del botón
  const handleButtonClick = () => {
    // Cambiar el estado para mostrar el div
    // Restablecer el estado del formulario
    // console.log(feature_id);
    setFormData({ feature_id: id, body: "" });
    // Ocultar el div
    setShowDiv(true);
    // Restablecer el estado de edición a falso
    setEditComment(false);
  };

  const handleCancelClick = () => {
    // Restablecer el estado del formulario
    setFormData({ body: "" });
    // Ocultar el div
    setShowDiv(false);
  };

  useEffect(() => {
    fetch(`http://localhost:3000/api/earthquakes/show_comments/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error en la solicitud: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        // console.log("Data recibida: ", data);
        // console.log("Data.feature: ", data.data.feature);
        // console.log("Data.comments: ", data.data.comments);
        if (data && data.data && data.data.feature) {
          setEarthquake(data.data.feature);
          setComments(data.data.comments);
          setLoading(false);
        } else {
          console.error(
            "No se encontraron datos para el terremoto con ID:",
            id
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(editComment);
    console.log(formData);
    if (!editComment) {
      console.log("Agregando comentario...");
      try {
        const response = await fetch(
          `http://localhost:3000/api/earthquakes/create_comment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        if (!response.ok) {
          throw new Error(
            `Error en la solicitud: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("Data recibida al agregar comentario:", data);
        // Actualizar los comentarios con los datos del nuevo comentario
        setComments((prevComments) => [...prevComments, data]);
        // Limpiar el formulario
        setFormData({ ...formData, body: "" });
        // Ocultar el div
        setShowDiv(false);
      } catch (error) {
        console.error("Error al enviar el comentario:", error);
      }
    } else {
      console.log("El comentario: ", commenteditedId);
      try {
        console.log("Editando comentario con ID:", commenteditedId);
        const response = await fetch(
          `http://localhost:3000/api/earthquakes/update_comment/${commenteditedId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        if (!response.ok) {
          throw new Error(
            `Error en la solicitud: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("Data recibida al editar comentario:", data);
        //actulizar los comentarios con el comentario editado
        const newComments = comments.map((comment) => {
          if (comment.id === data.id) {
            return data;
          }
          return comment;
        });
        setComments(newComments);
        //setFormData({ ...formData, body: "" });
        // Ocultar el div
        setShowDiv(false);
        setEditComment(false);
      } catch (error) {
        console.error("Error al enviar el comentario:", error);
      }
    }
  };

  const handleEditClick = (commentId) => {
    console.log(`Edit comment with ID: ${commentId}`);
    // cargar el comentario a editar en el div
    const commentToEdit = comments.find((comment) => comment.id === commentId);
    if (!commentToEdit) {
      console.error(`Comment with ID ${commentId} not found`);
      return;
    }
    // Actualizar el estado del formulario con los datos del comentario a editar
    setFormData({ ...formData, body: commentToEdit.body });
    setShowDiv(true);
    setEditComment(true);
    setCommenteditedId(commentId); // Actualizar commenteditedId con el ID del comentario que se está editando
  };

  const handleDeleteClick = (commentId) => {
    console.log(`Delete comment with ID: ${commentId}`);
    try {
      fetch(
        `http://localhost:3000/api/earthquakes/delete_comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error en la solicitud: ${response.status} ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log("Data recibida al eliminar comentario:", data);
          // Actualizar los comentarios con los datos del nuevo comentario
          const newComments = comments.filter(
            (comment) => comment.id !== commentId
          );
          setComments(newComments);
        })
        .catch((error) => {
          console.error("Error al eliminar el comentario:", error);
        });
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!earthquake) {
    return <div>No se encontraron detalles para este terremoto.</div>;
  }

  return (
    <div>
      <Navbar />
      <div
        className="pt-5"
        style={{ minHeight: "100vh", maxWidth: "75rem", marginLeft: "20px" }}
      >
        <h1 className="text-center">Earthquake details</h1>
        <br />
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary ml-auto"
            style={{ marginRight: "20px" }}
            onClick={() => window.location.href = `/earthquake`}
          >
            Back
          </button>
        </div>
        <br />
        <br />
        <div
          className="d-flex card bg-secondary mb-3 mr-3"
          style={{ maxWidth: "75rem", marginLeft: "20px" }}
        >
          <div className="earthquake-card">
            <h4>{earthquake.attributes.title}</h4>
            <p>
              <strong>Magnitude:</strong> {earthquake.attributes.magnitude}
            </p>
            <p>
              <strong>Time:</strong> {earthquake.attributes.time}
            </p>
            <p>
              <strong>Place:</strong> {earthquake.attributes.place}
            </p>
            <p>
              <strong>Coordinates:</strong>{" "}
              {earthquake.attributes.coordinates.latitude},{" "}
              {earthquake.attributes.coordinates.longitude}
            </p>
            <p>
              <strong>More info:</strong>{" "}
              <a className="btn btn-link text-info bold" style={{textDecoration:"none"}} href={earthquake.links.external_url}>More info</a>
            </p>
            <h5 className="bold fs-3">Comments:</h5>
            <table className="table table-hover">
              <thead>
                <tr className="text-center bold fs-4 fw-bold text-center">
                  <th scope="col">Comment</th>
                  <th scope="col">Created at</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, index) => {
                  // Verificar si comment es undefined o null
                  if (!comment) {
                    console.error(
                      `Comment at index ${index} is undefined or null`
                    );
                    return null;
                  }
                  //console.log(`Comment at index ${index}:`, comment);
                  return (
                    <tr key={comment.id} className="table-primary">
                      <td>
                        <strong>{comment.body}</strong>
                      </td>
                      <td className="text-center">
                        {
                          new Date(comment.created_at)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td>
                        <div className="text-center">
                        <button
                          className="btn btn-warning"
                          onClick={() => handleEditClick(comment.id)}
                        >
                          Edit
                        </button>{" "}
                        &nbsp;
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteClick(comment.id)}
                        >
                          Delete
                        </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="d-flex justify-content-end">
              {/* <div></div> Aquí puedes colocar cualquier otro contenido */}
              <button
                className="btn btn-success ml-auto"
                style={{ marginRight: "20px" }}
                onClick={handleButtonClick}
              >
                Add comment
              </button>
            </div>
            <br />
            {showDiv && (
              <div className="d-flex flex-fill" style={{ marginLeft: "20px" }}>
                {/* <h5>Add new comment:</h5> */}
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <label className="form-label mt-4" htmlFor="comment">
                      Comment:
                    </label>
                    <textarea
                      className="form-control"
                      type="text"
                      id="body"
                      name="body"
                      placeholder="Write a comment"
                      value={formData.body}
                      onChange={handleInputChange}
                    />
                    <div className="col-sm-6 mx-auto mt-3">
                      {" "}
                      {/* Dividir el ancho en 6 columnas, centrarlo y añadir margen superior */}
                      <button className="form-control btn btn-primary">
                        Guardar
                      </button>
                    </div>
                    <div className="col-sm-6 mx-auto mt-3">
                      {" "}
                      {/* Dividir el ancho en 6 columnas, centrarlo y añadir margen superior */}
                      <button
                        className="btn btn-danger form-control"
                        onClick={handleCancelClick}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EarthquakeDetail;
