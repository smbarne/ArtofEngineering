class CreateGalleryMedias < ActiveRecord::Migration
  def self.up
    create_table :gallery_medias do |t|
	      t.string :sTitle
    	      t.text :tDescription
	      t.string :medianame
	      t.references :gallery
      t.timestamps
    end
  end

  def self.down
    drop_table :gallery_medias
  end
end
