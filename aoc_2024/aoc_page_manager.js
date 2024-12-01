// ############################################################################################
// ############################################################################################
// ############################################################################################

export class AdventOfCode_Page_Manager {
    constructor(){
        this.initialise();
        this.hook_load_event();
    }

    initialise(){
        /**
         * list of daily blocks 
         */
        this.daily_block_list = [];
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * adding a days content to the lists
     * @param {*} input_data the input data for the day
     * @returns the index of the block
     */
    create_day(input_data){
        let index = this.daily_block_list.length;
        this.daily_block_list.push({
            data: input_data,
            parts: [],
            show_result: true,
        });
        return index;
    }
    /**
     * adds a part to the day by index
     * @param {*} day_index index of the day
     * @param {*} code_block function to process the data
     * @param {*} element_id the id of the element to modify with the answer
     */
    add_part_to_day(day_index, code_block, element_id){
        this.daily_block_list[day_index].parts.push({
            day_function: code_block,
            element_id: element_id,
        });

        this.day_count += 1;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    hook_load_event(){
        window.addEventListener( "load", (event)=>{
            if(this.verbose_logging){ console.log("--- preparing managed page content ---"); }
            this.page_main();
    
            if(this.verbose_logging){ console.log("--- starting apps ---"); }
            this.start();
        } );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * makes the blocks run
     */
    start(){
        this.run_blocks();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * gather inputs and run the blocks
     */
    page_main(){
        this.make_blocks();
        this.run_blocks();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * to be overriden
     */
    make_blocks(){}

    /**
     * runs all blocks we have
     */
    run_blocks(){
        // for all the day data blocks
        this.daily_block_list.forEach(daily_block_data => {
            if(daily_block_data.show_result){
                // ----------------------------------------------------------------
                // ----- get the current items for it
                
                const day_data = daily_block_data.data;
                const day_part_maps = daily_block_data.parts;
                
                // ----------------------------------------------------------------
                // ----- do the content
                
                day_part_maps.forEach(part_mapping => {
                    // run the block 
                    let answer = part_mapping.day_function(day_data);
                    // update the element
                    AdventOfCode_Page_Manager.set_element_value(part_mapping.element_id, answer);
                });
                
                // ---------------------------------------------------------------- 
            }
        });
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * gets element from the document by id
     * @param {*} element_id 
     * @returns 
     */
    static fetch_element(element_id){
        return document.querySelector(`#${element_id}`);
    }

    /**
     * set the content of an item
     * @param {*} id 
     * @param {*} value 
     */
    static set_element_value(id, value){
        let elem = AdventOfCode_Page_Manager.fetch_element(id);
        elem.innerHTML = value;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    turn_off_day(day_index){
        this.daily_block_list[day_index].show_result = false;
    }
    turn_on_day(day_index){
        this.daily_block_list[day_index].show_result = true;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}

// ############################################################################################
// ############################################################################################
// ############################################################################################