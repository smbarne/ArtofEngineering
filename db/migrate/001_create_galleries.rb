class CreateGalleries < ActiveRecord::Migration
  def self.up
    create_table :galleries do |t|
    	      t.string :sTitle
	      t.text :tDescription
	      t.string :sType
	      t.integer :iOrder
      t.timestamps
    end
  end

  def self.down
    drop_table :galleries
  end
end
