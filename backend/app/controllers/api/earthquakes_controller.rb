class Api::EarthquakesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create_comment, :update_comment, :index, :show_comments, :delete_comment]
  def index
    # Obtener la lista de características desde la base de datos
    features = Earthquake.all

    # Formatear la respuesta según el formato especificado en los requisitos
    render json: {
      data: features.map { |feature| format_feature(feature) }
    }
  end

  def show_comments
    # Encontrar el terremoto por su ID
    feature = Earthquake.find_by(id: params[:id])

    unless feature
      render json: { error: 'Feature not found' }, status: :not_found
      return
    end

    # Obtener los comentarios asociados al terremoto
    comments = feature.comments

    # Formatear la respuesta según el formato especificado en los requisitos
    render json: {
      data: {
        feature: format_feature(feature),
        comments: format_comments(comments)
      }
    }
  end

  def update_comment
    comment = Comment.find_by(id: params[:id])

    unless comment
      render json: { error: 'Comment not found' }, status: :not_found
      return
    end

    if comment.update(body: params[:body])
      render json: comment, status: :ok
    else
      render json: { error: comment.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  #delete comment
  def delete_comment
    comment = Comment.find_by(id: params[:id])
    unless comment
      render json: { error: 'Comment not found' }, status: :not_found
      return
    end
  
    if comment.destroy
      render json: { message: 'Comment deleted successfully' }, status: :ok
    else
      render json: { error: 'Failed to delete comment' }, status: :unprocessable_entity
    end
  end
  


  def create_comment
    # Recibir el payload del comentario
    feature_id = params[:feature_id]
    body = params[:body]

    # Validar los datos recibidos
    unless feature_id.present? && body.present?
      render json: { error: 'Feature ID and Body are required' }, status: :unprocessable_entity
      return
    end

    # Buscar el feature correspondiente en la base de datos
    feature = Earthquake.find_by(id: feature_id)

    unless feature
      render json: { error: 'Feature not found' }, status: :not_found
      return
    end

    # Crear el comentario asociado al feature
    comment = feature.comments.create(body: body)

    if comment.persisted?
      render json: comment, status: :created
    else
      render json: { error: comment.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  private

  # Método para formatear una característica (earthquake)
  def format_feature(feature)
    {
      id: feature.id,
      type: 'feature',
      attributes: {
        external_id: feature.id, # Reemplazar con el ID externo si es necesario
        magnitude: feature.magnitude,
        place: feature.place,
        time: feature.created_at.strftime('%Y-%m-%d %H:%M:%S'), # Formato de ejemplo
        tsunami: feature.tsunami,
        mag_type: feature.mag_type,
        title: feature.title,
        coordinates: {
          longitude: feature.longitude,
          latitude: feature.latitude
        }
      },
      links: {
        external_url: feature.url
      }
    }
  end

  def format_comments(comments)
    comments.map do |comment|
      {
        id: comment.id,
        body: comment.body,
        created_at: comment.created_at.strftime('%Y-%m-%d %H:%M:%S')
      }
    end
  end
end
