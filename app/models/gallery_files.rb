class GalleryFiles < ActiveRecord::Base
	belongs_to :gallery
	
	file_column :filename
end
