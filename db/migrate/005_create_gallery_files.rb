class CreateGalleryFiles < ActiveRecord::Migration
  def self.up
    create_table :gallery_files do |t|
	  t.string :sTitle
          t.text :sDescription
          t.string :filename
	  t.references :gallery
      t.timestamps
    end
  end

  def self.down
    drop_table :gallery_files
  end
end
