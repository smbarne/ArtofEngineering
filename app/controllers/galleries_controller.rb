class GalleriesController < ApplicationController
#before_filter :login_required, :only => [:new, :edit, :create, :update, :destroy]
layout "main"
before_filter :login_required, :only => [:new, :edit, :create, :update, :destroy, :createFile, :createMedia, :destroy_file]

  def index
    @galleries = Gallery.find(:all)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @galleries }
    end
  end

  # GET /galleries/1
  # GET /galleries/1.xml
  def show
    @gallery = Gallery.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @gallery }
    end
  end

  # GET /galleries/new
  # GET /galleries/new.xml
  def new
    @gallery = Gallery.new
    @iOrders = Gallery.find(:all).map { |i| i.iOrder.to_s }.uniq
    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @gallery }
    end
  end

  # GET /galleries/1/edit
  def edit
    @gallery = Gallery.find(params[:id])
    @iOrders = Gallery.find(:all).map { |i| i.iOrder.to_s }
  end


  # POST /galleries
  # POST /galleries.xml
  def create
    @gallery = Gallery.new(params[:gallery])
    
    respond_to do |format|
      if @gallery.save
      	createFile(@gallery.id)
      	createMedia(@gallery.id)

        flash[:notice] = 'Gallery was successfully created.'
        format.html { redirect_to(@gallery) }
        format.xml  { render :xml => @gallery, :status => :created, :location => @gallery }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @gallery.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /galleries/1
  # PUT /galleries/1.xml
  def update
    @gallery = Gallery.find(params[:id])
    
    respond_to do |format|
      if @gallery.update_attributes(params[:gallery])
      
      	createFile(params[:id])
      	createMedia(params[:id])
      
        flash[:notice] = 'Gallery was successfully updated.'
        format.html { redirect_to(@gallery) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @gallery.errors, :status => :unprocessable_entity }
      end
    end
  end
  
    def createMedia(id)
	params[:gallery_media].each do |media|
   		GalleryMedia.create(:medianame => media[1], :gallery_id => id ) if !media[1].blank?
 	end    
  end
  
  def createFile(id)
	params[:gallery_files].each do |file|
   		GalleryFiles.create(:filename => file[1], :gallery_id => id ) if !file[1].blank?
 	end
  end

  #Used to delete an uploaded file in a Gallery
  #Destroys the actual file from the hard disk using file_column
  #Destroys database link
  #Requires:
  # 		params:
  # 				:id -> id of model that contains the file
  # 				:file_id -> id of file to be deleted
   def destroy_file
  
    if params[:type] == "File"
	    @file = GalleryFiles.find(params[:file_id])
    elsif params[:type] == "Media"
            @file = GalleryMedia.find(params[:file_id])
    end
    @file.destroy

    respond_to do |format|
      format.html { redirect_to(edit_setup_path(params[:id])) }
       format.js {
		render :update do |page|
			if params[:type] == "File"
			 page.visual_effect :blind_up, "File_#{params[:file_id].to_s}"
			elsif params[:type] == "Media"
			 page.visual_effect :blind_up, "Media_#{params[:file_id].to_s}"
 			 page.visual_effect :blind_up, "Media_Attributes_#{params[:file_id].to_s}"
			end
		end
  		}
    end
  end

  # DELETE /galleries/1
  # DELETE /galleries/1.xml
  def destroy
    @gallery = Gallery.find(params[:id])
    @gallery.destroy

    respond_to do |format|
      format.html { redirect_to(galleries_url) }
      format.xml  { head :ok }
    end
  end
end
