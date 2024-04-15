Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins '*'  # Aquí puedes especificar los dominios permitidos, '*' permite a todos los dominios.
      
      resource '*',   # Rutas a las que se aplicarán estas configuraciones de CORS
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options]  # Métodos HTTP permitidos
    end
  end
  