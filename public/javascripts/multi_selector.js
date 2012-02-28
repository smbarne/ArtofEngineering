/**
 * Convert a single file-input element into a 'multiple' input list
 *
 * Usage:
 *
 *   1. Create a file input element (no name)
 *      eg. <input type="file" id="first_file_element">
 *
 *   2. Create a DIV for the output to be written to
 *      eg. <div id="files_list"></div>
 *
 *   3. Instantiate a MultiSelector object, arguments:
 *      Pass in the Object of the div of the output list
 *      Pass an (optional) maximum number of files
 *      Pass the element_id, this is for using this script multiple times in a page
 *      Pass the allowed file extensions javascript array (optional)
 *
 *      You can edit this two more options:
 *      // Should we display the filename only (without the path)
 *      this.filename_only = true;
 *      // Should there be a confirmation for deletion of the upload queue?
 *      var ask_for_deletion_confirmation = true;
 *
 *   4. Add the first element
 *      eg. multi_selector.addElement( document.getElementById( 'first_file_element' ) );
 *
 *   5. That's it.
 *
 *   For example:
       <input id="collection_preview" type="file" name="collection_preview_1" />
       <div id="collection_preview_list"></div>
       <script type="text/javascript">
         var multi_selector = new MultiSelector( document.getElementById('collection_preview_list'), 0, 'collection_preview', new Array('jpg', 'gif', 'png') );
         multi_selector.addElement( document.getElementById( 'collection_preview' ) );
       </script>
 *
 *   You might (will) want to play around with the addListRow() method to make the output prettier.
 *
 * Licence:
 *   Use this however/wherever you like, just don't blame me if it breaks anything.
 *
 * Credit:
 *   If you're nice, you'll leave this bit:
 *
 *   Class by Stickman -- http://www.the-stickman.com
 *     pimped by Johannes Leers -- http://www.gauda.de
 */
function MultiSelector( list_target, max, element_id, allowed_file_extensions ){

  // Where to write the list
  this.list_target = list_target;
  // How many elements?
  this.count = 0;
  // How many elements?
  this.id = 0;
  // Is there a maximum?
  if( max ){
    this.max = max;
  } else {
    this.max = -1;
  };
        this.element_id = element_id;

        // Should we display the filename only (without the path)
        this.filename_only = true;
        // Should there be a confirmation for deletion of the upload queue?
        var ask_for_deletion_confirmation = true;

  /**
   * Add a new file input element
   */
  this.addElement = function( element ){

    // Make sure it's a file input element
    if( element.tagName == 'INPUT' && element.type == 'file' ){

      // Element name -- what number am I?
      element.name = this.element_id + '[' + this.id++ + ']';

      // Add reference to this object
      element.multi_selector = this;

      // What to do when a file is selected
      element.onchange = function(){
                                // Check if file extension is valid
                                if(allowed_file_extensions){
                                  var file_extension = this.value.substr(this.value.lastIndexOf(".")+1, this.value.length).toLowerCase();
                                  var file_extension_valid = false;
                                  for(var i=0; i < allowed_file_extensions.length; i++) {
                                    if(allowed_file_extensions[i] == file_extension) {
                                      file_extension_valid = true;
                                    }
                                  }
                                  // Abort if file extension is not valid
                                  if(!file_extension_valid){
                                    alert('This file extension is not valid!');
                                    this.value = '';
                                    return;
                                  }
                                }

        // New file input
        var new_element = document.createElement( 'input' );
        new_element.type = 'file';

        // Add new element
        this.parentNode.insertBefore( new_element, this );

        // Apply 'update' to element
        this.multi_selector.addElement( new_element );

        // Update list
        this.multi_selector.addListRow( this );

        // Hide this: we can't use display:none because Safari doesn't like it
        this.style.position = 'absolute';
        this.style.left = '-1000px';

      };
      // If we've reached maximum number, disable input element
      if( this.max != -1 && this.count >= this.max ){
        element.disabled = true;
      };

      // File element counter
      this.count++;
      // Most recent element
      this.current_element = element;

    } else {
      // This can only be applied to file input elements!
      alert( 'Error: not a file input element' );
    };

  };

  /**
   * Add a new row to the list of files
   */
  this.addListRow = function( element ){

    // Row div
    var new_row = document.createElement( 'div' );

    // Delete image
    var new_row_image = document.createElement( 'img' );
    new_row_image.src = '/images/icon-delete.gif';
    new_row_image.alt = 'Delete this file from upload queue!';
    new_row_image.title = 'Delete this file from upload queue!';

    // References
    new_row.element = element;

    // Delete function
    new_row_image.onclick = function(){
                  if(!ask_for_deletion_confirmation || confirm('Are you sure you want to delete this file from upload queue?')==true){

                    // Remove element from form
                    this.parentNode.element.parentNode.removeChild( this.parentNode.element );

                    // Remove this row from the list
                    this.parentNode.parentNode.removeChild( this.parentNode );

                    // Decrement counter
                    this.parentNode.element.multi_selector.count--;

                    // Re-enable input element (if it's disabled)
                    this.parentNode.element.multi_selector.current_element.disabled = false;

                    // Appease Safari
                    //    without it Safari wants to reload the browser window
                    //    which nixes your already queued uploads
                    return false;
                  }

    };

    // Add image
    new_row.appendChild( new_row_image );

                // Edit output if filename only
                if(this.filename_only){
                  var filename = element.value.match(/(.*)[\/\\]([^\/\\]+\.\w+)$/);
                  filename = (filename == null)? element.value : filename[2];
                }else{
                  var filename = element.value;
                }

    // Set row value
    new_row.appendChild( document.createTextNode(filename) );

    // Add it to the list
    this.list_target.appendChild( new_row );

  };

};

