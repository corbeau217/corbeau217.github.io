
import { Scene_Object   } from "/ext/webgl_1_core/src/scene_objects/scene_object.js";
import { Can            } from "/webgl1/lib/shapes/can.js";
import { Crate          } from "/webgl1/lib/shapes/crate.js";
import { Sphere         } from "/webgl1/lib/shapes/sphere.js";
import { Turbofan       } from "/webgl1/lib/shapes/turbofan.js";
import { Turbofan as Turbofan02 } from "/webgl1/lib/shapes/turbofan_02.js";
import { Lorenz         } from "/webgl1/lib/shapes/lorenz.js";
import { Book           } from "/webgl1/lib/shapes/book.js";
import { Joint          } from "/webgl1/lib/shapes/joint.js";
import { Barrel         } from "/webgl1/lib/shapes/barrel.js";
import { Sphere_Cube    } from "/webgl1/lib/shapes/sphere_cube.js";

export const GALLERY_SHAPES_DB = [
    { index: 0, id: "clear",        type: Scene_Object,    thumbnail: "/img/bookicon.png" },
    { index: 1, id: "can",          type: Can,             thumbnail: "/img/thumbs/shape_gallery/can_01.png"        },
    { index: 2, id: "crate",        type: Crate,           thumbnail: "/img/thumbs/shape_gallery/crate_02.png"      },
    { index: 3, id: "sphere",       type: Sphere,          thumbnail: "/img/thumbs/shape_gallery/sphere_01.png"     },
    { index: 4, id: "turbofan",     type: Turbofan,        thumbnail: "/img/thumbs/shape_gallery/turbofan_01.png"   },
    { index: 5, id: "lorenz",       type: Lorenz,          thumbnail: "/img/thumbs/shape_gallery/lorenz_01.png"     },
    { index: 6, id: "book",         type: Book,            thumbnail: "/img/thumbs/shape_gallery/book_02.png"       },
    { index: 7, id: "joint",        type: Joint,           thumbnail: "/img/thumbs/shape_gallery/joint_01.png"      },
    { index: 8, id: "turbofan_02",  type: Turbofan02,      thumbnail: "/img/thumbs/shape_gallery/turbofan_03.png"   },
    { index: 9, id: "barrel",       type: Barrel,          thumbnail: "/img/thumbs/shape_gallery/barrel_01.png"   },
    { index: 10,id: "spherecube",   type: Sphere_Cube,     thumbnail: "/img/thumbs/shape_gallery/sphere_cube.png"   },
];