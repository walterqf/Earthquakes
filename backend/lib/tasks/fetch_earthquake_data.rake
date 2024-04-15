# lib/tasks/fetch_earthquake_data.rake

require 'httparty'

namespace :earthquake do
  desc 'Fetch earthquake data from USGS and persist in the database'
  task fetch_data: :environment do
    response = HTTParty.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
    data = JSON.parse(response.body)

    # Procesa cada elemento del GeoJSON y guarda la información en la base de datos
    data['features'].each do |feature|
      # Procesa los datos del feature y crea un nuevo registro en la base de datos
      Earthquake.create_from_feature(feature)
    end
  end
end
