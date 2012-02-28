class Gallery < ActiveRecord::Base
	has_many :gallery_files
	has_many :gallery_medias

	belongs_to :artwork
	belongs_to :engineering	
	
	def media_fields_update=(media_fields)
		media_fields.each do |id, media|
			if (GalleryMedia.exists?(id))
				GalleryMedia.find(id).update_attributes(media)
			end 
		end
	end
end
