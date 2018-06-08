/*
 * Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
 *
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

// #if B2_ENABLE_CONTROLLER

import { b2Body } from "../Dynamics/b2Body";
import { b2TimeStep } from "../Dynamics/b2TimeStep";
import { b2Draw } from "../Common/b2Draw";

/**
 * A controller edge is used to connect bodies and controllers
 * together in a bipartite graph.
 */
export class b2ControllerEdge {
  public controller: b2Controller; ///< provides quick access to other end of this edge.
  public body: b2Body; ///< the body
  constructor(controller: b2Controller, body: b2Body) {
    this.controller = controller;
    this.body = body;
  }
}

/**
 * Base class for controllers. Controllers are a convience for
 * encapsulating common per-step functionality.
 */
export abstract class b2Controller {
  // m_world: b2World;
  public readonly m_bodyList: Set<b2ControllerEdge> = new Set<b2ControllerEdge>();

  /**
   * Controllers override this to implement per-step functionality.
   */
  public abstract Step(step: b2TimeStep): void;

  /**
   * Controllers override this to provide debug drawing.
   */
  public abstract Draw(debugDraw: b2Draw): void;

  /**
   * Get the parent world of this body.
   */
  // GetWorld() {
  //   return this.m_world;
  // }

  /**
   * Get the attached body list
   */
  public GetBodyList(): Set<b2ControllerEdge> {
    return this.m_bodyList;
  }

  /**
   * Adds a body to the controller list.
   */
  public AddBody(body: b2Body): void {
    const edge = new b2ControllerEdge(this, body);

    //Add edge to controller list
    this.m_bodyList.add(edge);

    //Add edge to body list
    body.m_controllerList.add(edge);
  }

  /**
   * Removes a body from the controller list.
   */
  public RemoveBody(body: b2Body): void {
    //Assert that the controller is not empty
    if (this.m_bodyList.size <= 0) { throw new Error(); }

    //Find the corresponding edge
    /*b2ControllerEdge*/
    let edge = null;
    for (const e of this.m_bodyList) {
      if (e.body === body) {
        edge = e;
      }
    }

    //Assert that we are removing a body that is currently attached to the controller
    if (edge === null) { throw new Error(); }

    //Remove edge from controller list
    this.m_bodyList.delete(edge);

    //Remove edge from body list
    body.m_controllerList.delete(edge);
  }

  /**
   * Removes all bodies from the controller list.
   */
  public Clear(): void {
    for (const edge of this.m_bodyList) {
      this.RemoveBody(edge.body);
    }
  }
}

// #endif