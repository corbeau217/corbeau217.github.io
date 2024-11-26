
import { Scene_Object   } from "/ogl/core/scene_objects/scene_object.js";
import { Can            } from "/ogl/lib/shapes/can.js";
import { Crate          } from "/ogl/lib/shapes/crate.js";
import { Sphere         } from "/ogl/lib/shapes/sphere.js";
import { Turbofan       } from "/ogl/lib/shapes/turbofan.js";
import { Lorenz         } from "/ogl/lib/shapes/lorenz.js";
import { Book           } from "/ogl/lib/shapes/book.js";

export const GALLERY_SHAPES_DB = [
    { index: 0, id: "clear",        type: Scene_Object,    thumbnail: "/img/bookicon.png" },
    { index: 1, id: "can",          type: Can,             thumbnail: "/img/bookicon.png" },
    { index: 2, id: "crate",        type: Crate,           thumbnail: "/img/bookicon.png" },
    { index: 3, id: "sphere",       type: Sphere,          thumbnail: "/img/thumbs/shape_gallery/sphere_01.png"     },
    { index: 4, id: "turbofan",     type: Turbofan,        thumbnail: "/img/thumbs/shape_gallery/turbofan_01.png"   },
    { index: 5, id: "lorenz",       type: Lorenz,          thumbnail: "/img/thumbs/shape_gallery/lorenz_01.png"     },
    { index: 6, id: "book",         type: Book,            thumbnail: "/img/thumbs/shape_gallery/book_01.png" },
];