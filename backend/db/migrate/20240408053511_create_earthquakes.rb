class CreateEarthquakes < ActiveRecord::Migration[6.1]
  def change
    create_table :earthquakes do |t|
      t.string :title, null: false
      t.string :url, null: false
      t.string :place, null: false
      t.string :mag_type, null: false
      t.float :magnitude, null: false
      t.float :latitude, null: false
      t.float :longitude, null: false
      t.boolean :tsunami
      t.timestamps
    end
  end
end
