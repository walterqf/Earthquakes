Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  # get "up" => "rails/health#show", as: :rails_health_check

  # # Say hello world
  # get "/earthquakes" => "earthquakes#index", as: :index

  namespace :api do
    resources :earthquakes, only: [:index] do
      post 'create_comment', on: :collection
      patch 'update_comment/:id', to: 'earthquakes#update_comment', on: :collection
      get 'show_comments/:id', to: 'earthquakes#show_comments', on: :collection
      delete 'delete_comment/:id', to: 'earthquakes#delete_comment', on: :collection
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end

