class Earthquake < ApplicationRecord
  has_many :comments, dependent: :destroy
  validates :title, :url, :place, :mag_type, :magnitude, :latitude, :longitude, presence: true
  validates :magnitude, numericality: { greater_than_or_equal_to: -1.0, less_than_or_equal_to: 10.0 }
  validates :latitude, numericality: { greater_than_or_equal_to: -90.0, less_than_or_equal_to: 90.0 }
  validates :longitude, numericality: { greater_than_or_equal_to: -180.0, less_than_or_equal_to: 180.0 }

  def self.create_from_feature(feature)
    properties = feature['properties']
    geometry = feature['geometry']['coordinates']

    # Crea un nuevo registro de terremoto utilizando los datos del feature
    Earthquake.create(
      title: properties['title'],
      url: properties['url'],
      place: properties['place'],
      mag_type: properties['magType'],
      magnitude: properties['mag'],
      latitude: geometry[1],
      longitude: geometry[0]
    )
  end
end
  