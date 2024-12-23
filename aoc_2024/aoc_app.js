// ############################################################################################
// ############################################################################################
// ############################################################################################

import { AdventOfCode_Page_Manager } from "./aoc_page_manager.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################

// -------------------
// ----- day_01
import { code_block as code_block_day_01_1 } from "./blocks/day_01/day_01_1.js";
import { code_block as code_block_day_01_2 } from "./blocks/day_01/day_01_2.js";
// ----- day_02
import { code_block as code_block_day_02_1 } from "./blocks/day_02/day_02_1.js";
import { code_block as code_block_day_02_2 } from "./blocks/day_02/day_02_2.js";
// ----- day_03
import { code_block as code_block_day_03_1 } from "./blocks/day_03/day_03_1.js";
import { code_block as code_block_day_03_2 } from "./blocks/day_03/day_03_2.js";
// ----- day_04
import { code_block as code_block_day_04_1 } from "./blocks/day_04/day_04_1.js";
import { code_block as code_block_day_04_2 } from "./blocks/day_04/day_04_2.js";
// ----- day_05
import { code_block as code_block_day_05_1 } from "./blocks/day_05/day_05_1.js";
import { code_block as code_block_day_05_2 } from "./blocks/day_05/day_05_2.js";
// ----- day_06
import { code_block as code_block_day_06_1 } from "./blocks/day_06/day_06_1.js";
import { code_block as code_block_day_06_2 } from "./blocks/day_06/day_06_2.js";
// ----- day_07
import { code_block as code_block_day_07_1 } from "./blocks/day_07/day_07_1.js";
import { code_block as code_block_day_07_2 } from "./blocks/day_07/day_07_2.js";
// ----- day_08
import { code_block as code_block_day_08_1 } from "./blocks/day_08/day_08_1.js";
import { code_block as code_block_day_08_2 } from "./blocks/day_08/day_08_2.js";
// ----- day_09
import { code_block as code_block_day_09_1 } from "./blocks/day_09/day_09_1.js";
import { code_block as code_block_day_09_2 } from "./blocks/day_09/day_09_2.js";
// ----- day_10
import { code_block as code_block_day_10_1 } from "./blocks/day_10/day_10_1.js";
import { code_block as code_block_day_10_2 } from "./blocks/day_10/day_10_2.js";
// ----- day_11
import { code_block as code_block_day_11_1 } from "./blocks/day_11/day_11_1.js";
import { code_block as code_block_day_11_2 } from "./blocks/day_11/day_11_2.js";
// ----- day_12
import { code_block as code_block_day_12_1 } from "./blocks/day_12/day_12_1.js";
import { code_block as code_block_day_12_2 } from "./blocks/day_12/day_12_2.js";
// ----- day_13
import { code_block as code_block_day_13_1 } from "./blocks/day_13/day_13_1.js";
import { code_block as code_block_day_13_2 } from "./blocks/day_13/day_13_2.js";
// ----- day_14
import { code_block as code_block_day_14_1 } from "./blocks/day_14/day_14_1.js";
import { code_block as code_block_day_14_2 } from "./blocks/day_14/day_14_2.js";
// ----- day_15
import { code_block as code_block_day_15_1 } from "./blocks/day_15/day_15_1.js";
import { code_block as code_block_day_15_2 } from "./blocks/day_15/day_15_2.js";
// ----- day_16
import { code_block as code_block_day_16_1 } from "./blocks/day_16/day_16_1.js";
import { code_block as code_block_day_16_2 } from "./blocks/day_16/day_16_2.js";
// ----- day_17
import { code_block as code_block_day_17_1 } from "./blocks/day_17/day_17_1.js";
import { code_block as code_block_day_17_2 } from "./blocks/day_17/day_17_2.js";
// ----- day_18
import { code_block as code_block_day_18_1 } from "./blocks/day_18/day_18_1.js";
import { code_block as code_block_day_18_2 } from "./blocks/day_18/day_18_2.js";
// ----- day_19
import { code_block as code_block_day_19_1 } from "./blocks/day_19/day_19_1.js";
import { code_block as code_block_day_19_2 } from "./blocks/day_19/day_19_2.js";
// ----- day_20
import { code_block as code_block_day_20_1 } from "./blocks/day_20/day_20_1.js";
import { code_block as code_block_day_20_2 } from "./blocks/day_20/day_20_2.js";
// ----- day_21
import { code_block as code_block_day_21_1 } from "./blocks/day_21/day_21_1.js";
import { code_block as code_block_day_21_2 } from "./blocks/day_21/day_21_2.js";
// ----- day_22
import { code_block as code_block_day_22_1 } from "./blocks/day_22/day_22_1.js";
import { code_block as code_block_day_22_2 } from "./blocks/day_22/day_22_2.js";
// ----- day_23
import { code_block as code_block_day_23_1 } from "./blocks/day_23/day_23_1.js";
import { code_block as code_block_day_23_2 } from "./blocks/day_23/day_23_2.js";
// ----- day_24
import { code_block as code_block_day_24_1 } from "./blocks/day_24/day_24_1.js";
import { code_block as code_block_day_24_2 } from "./blocks/day_24/day_24_2.js";
// ----- day_25
import { code_block as code_block_day_25_1 } from "./blocks/day_25/day_25_1.js";
import { code_block as code_block_day_25_2 } from "./blocks/day_25/day_25_2.js";
// -------------------

// ############################################################################################
// ############################################################################################
// ############################################################################################


export class AdventOfCode_App extends AdventOfCode_Page_Manager {
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * overriding parent function
     */
    map_code_blocks(){
        super.map_code_blocks();
        // ------------------------------------
        // ----- prepare data for use between days

        let current_day_index = 0;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day 1
        
        this.add_part_to_day( current_day_index, code_block_day_01_1, "answer_day_01_1" );
        this.add_part_to_day( current_day_index, code_block_day_01_2, "answer_day_01_2" );
        current_day_index++;

        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_02
        
        this.add_part_to_day( current_day_index, code_block_day_02_1, "answer_day_02_1" );
        this.add_part_to_day( current_day_index, code_block_day_02_2, "answer_day_02_2" );
        current_day_index++;

        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_03
        
        this.add_part_to_day( current_day_index, code_block_day_03_1, "answer_day_03_1" );
        this.add_part_to_day( current_day_index, code_block_day_03_2, "answer_day_03_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_04
        
        this.add_part_to_day( current_day_index, code_block_day_04_1, "answer_day_04_1" );
        this.add_part_to_day( current_day_index, code_block_day_04_2, "answer_day_04_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_05
        
        this.add_part_to_day( current_day_index, code_block_day_05_1, "answer_day_05_1" );
        this.add_part_to_day( current_day_index, code_block_day_05_2, "answer_day_05_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_06
        
        this.add_part_to_day( current_day_index, code_block_day_06_1, "answer_day_06_1" );
        this.add_part_to_day( current_day_index, code_block_day_06_2, "answer_day_06_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_07
        
        this.add_part_to_day( current_day_index, code_block_day_07_1, "answer_day_07_1" );
        this.add_part_to_day( current_day_index, code_block_day_07_2, "answer_day_07_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_08
        
        this.add_part_to_day( current_day_index, code_block_day_08_1, "answer_day_08_1" );
        this.add_part_to_day( current_day_index, code_block_day_08_2, "answer_day_08_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_09
        
        this.add_part_to_day( current_day_index, code_block_day_09_1, "answer_day_09_1" );
        this.add_part_to_day( current_day_index, code_block_day_09_2, "answer_day_09_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_10
        
        this.add_part_to_day( current_day_index, code_block_day_10_1, "answer_day_10_1" );
        this.add_part_to_day( current_day_index, code_block_day_10_2, "answer_day_10_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_11
        
        this.add_part_to_day( current_day_index, code_block_day_11_1, "answer_day_11_1" );
        this.add_part_to_day( current_day_index, code_block_day_11_2, "answer_day_11_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_12
        
        this.add_part_to_day( current_day_index, code_block_day_12_1, "answer_day_12_1" );
        this.add_part_to_day( current_day_index, code_block_day_12_2, "answer_day_12_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_13
        
        this.add_part_to_day( current_day_index, code_block_day_13_1, "answer_day_13_1" );
        this.add_part_to_day( current_day_index, code_block_day_13_2, "answer_day_13_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_14
        
        this.add_part_to_day( current_day_index, code_block_day_14_1, "answer_day_14_1" );
        this.add_part_to_day( current_day_index, code_block_day_14_2, "answer_day_14_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_15
        
        this.add_part_to_day( current_day_index, code_block_day_15_1, "answer_day_15_1" );
        this.add_part_to_day( current_day_index, code_block_day_15_2, "answer_day_15_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_16
        
        this.add_part_to_day( current_day_index, code_block_day_16_1, "answer_day_16_1" );
        this.add_part_to_day( current_day_index, code_block_day_16_2, "answer_day_16_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_17
        
        this.add_part_to_day( current_day_index, code_block_day_17_1, "answer_day_17_1" );
        this.add_part_to_day( current_day_index, code_block_day_17_2, "answer_day_17_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_18
        
        this.add_part_to_day( current_day_index, code_block_day_18_1, "answer_day_18_1" );
        this.add_part_to_day( current_day_index, code_block_day_18_2, "answer_day_18_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_19
        
        this.add_part_to_day( current_day_index, code_block_day_19_1, "answer_day_19_1" );
        this.add_part_to_day( current_day_index, code_block_day_19_2, "answer_day_19_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_20
        
        this.add_part_to_day( current_day_index, code_block_day_20_1, "answer_day_20_1" );
        this.add_part_to_day( current_day_index, code_block_day_20_2, "answer_day_20_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_21
        
        this.add_part_to_day( current_day_index, code_block_day_21_1, "answer_day_21_1" );
        this.add_part_to_day( current_day_index, code_block_day_21_2, "answer_day_21_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_22
        
        this.add_part_to_day( current_day_index, code_block_day_22_1, "answer_day_22_1" );
        this.add_part_to_day( current_day_index, code_block_day_22_2, "answer_day_22_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_23
        
        this.add_part_to_day( current_day_index, code_block_day_23_1, "answer_day_23_1" );
        this.add_part_to_day( current_day_index, code_block_day_23_2, "answer_day_23_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_24
        
        this.add_part_to_day( current_day_index, code_block_day_24_1, "answer_day_24_1" );
        this.add_part_to_day( current_day_index, code_block_day_24_2, "answer_day_24_2" );
        current_day_index++;
        
        // ---------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ day_25
        
        this.add_part_to_day( current_day_index, code_block_day_25_1, "answer_day_25_1" );
        this.add_part_to_day( current_day_index, code_block_day_25_2, "answer_day_25_2" );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}

// ############################################################################################
// ############################################################################################
// ############################################################################################

let app = new AdventOfCode_App();

// ############################################################################################
// ############################################################################################
// ############################################################################################