import { defineStore } from "pinia";
import type { Node, Edge, Connection } from "@vue-flow/core";
import { ref } from "vue";
import { useManualRefHistory, onKeyDown } from "@vueuse/core";
interface NodeType {
  name: string;
  description: string;
  type: "default" | "container";
  data: {
    contentType?: string[];
    content?: string[];
    inputs?: string[];
    outputs?: string[];
  };
}

export const useFlowStore = defineStore("flow", () => {
  const nodeTypes = [
    {
      name: "Input",
      description: "Provides input values",
      type: "default",
      data: {
        outputs: ["output"]
      }
    },
    {
      name: "Output",
      description: "Displays output values",
      type: "default",
      data: {
        inputs: ["input"]
      }
    },
    {
      name: "Math",
      description: "Performs mathematical operations",
      type: "default",
      data: {
        inputs: ["a", "b"],
        outputs: ["result"]
      }
    },
    {
      name: "Transform",
      description: "Transforms input data",
      type: "default",
      data: {
        inputs: ["input"],
        outputs: ["transformed"]
      }
    },
    {
      name: "Container",
      description: "Groups nodes together",
      type: "container",
      data: {
        isContainer: true,
        children: [],
        inputs: ["input"],
        outputs: ["output"]
      }
    }
  ] as NodeType[];

  // const nodes = ref<Node[]>([]);
  // const edges = ref<Edge[]>([]);
  // const history = ref<{ nodes: Node[]; edges: Edge[] }[]>([]);
  // const historyIndex = ref(-1);
  // const ref_history = ref(null);
  // let workflow = ref({ nodes, edges });
  // ref_history.value = useManualRefHistory(workflow, { clone: true });
  const nodesRef = ref<Node[]>([]);
  const edgesRef = ref<Edge[]>([]);

  const {
    // history: nodesHistory,
    commit: commitNodes,
    undo: undoNodes,
    redo: redoNodes
  } = useManualRefHistory(nodesRef, {
    capacity: 100,
    clone: true
  });

  const {
    // history: edgesHistory,
    commit: commitEdges,
    undo: undoEdges,
    redo: redoEdges
  } = useManualRefHistory(edgesRef, {
    capacity: 100,
    clone: true
  });

  function getNodeDataByType(type: string) {
    const nodeType = nodeTypes.find(t => t.name === type);
    return nodeType
      ? nodeType.data
      : { inputs: ["input"], outputs: ["output"] };
  }

  function addNode(node: Node) {
    // const newId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNode = {
      ...node,
      id: node.id,
      dragHandle: ".custom-node-header",
      style: {
        opacity: 1,
        transition: "all 250ms ease",
        width: "200px",
        height: node.data?.isContainer ? "300px" : "150px"
      }
    };
    nodesRef.value.push(newNode);
    commitNodes();
  }

  const setParentNode = (nodeId: string, parentId: string | undefined) => {
    const node = nodesRef.value.find(n => n.id === nodeId);
    if (node) {
      const oldParentId = node.parentNode;
      node.parentNode = parentId;

      if (parentId) {
        const parent = nodesRef.value.find(n => n.id === parentId);
        if (parent) {
          // 调整节点位置为相对于父节点的位置
          const parentPos = parent.position;
          node.position = {
            x: node.position.x - parentPos.x,
            y: node.position.y - parentPos.y
          };
          node.extent = "parent";
          node.expandParent = true;
          node.draggable = true;
          node.selectable = true;
        }
      } else if (oldParentId) {
        // 恢复为绝对位置
        const oldParent = nodesRef.value.find(n => n.id === oldParentId);
        if (oldParent) {
          node.position = {
            x: node.position.x + oldParent.position.x,
            y: node.position.y + oldParent.position.y
          };
        }
        node.extent = undefined;
        node.expandParent = undefined;
      }
    }
  };

  function updateNodeDimensions(
    nodeId: string,
    dimensions: { width?: number; height?: number }
  ) {
    const node = nodesRef.value.find(n => n.id === nodeId);
    if (node && node.style) {
      node.style = {
        ...node.style,
        ...(dimensions.width && { width: `${dimensions.width}px` }),
        ...(dimensions.height && { height: `${dimensions.height}px` })
      };
      commitNodes();
    }
  }

  function addChildToContainer(containerId: string, childId: string) {
    const container = nodesRef.value.find(n => n.id === containerId);
    if (container && container.data?.isContainer) {
      if (!container.data.children) {
        container.data.children = [];
      }
      container.data.children.push(childId);
      commitNodes();
    }
  }

  function removeChildFromContainer(containerId: string, childId: string) {
    const container = nodesRef.value.find(n => n.id === containerId);
    if (container && container.data?.children) {
      container.data.children = container.data.children.filter(
        id => id !== childId
      );
      commitNodes();
    }
  }

  function onConnect(connection: Connection) {
    if (!connection.source || !connection.target) return;

    const connectionExists = edgesRef.value.some(
      edge =>
        edge.source === connection.source &&
        edge.target === connection.target &&
        edge.sourceHandle === connection.sourceHandle &&
        edge.targetHandle === connection.targetHandle
    );

    if (connectionExists) return;

    const newEdge: Edge = {
      id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: "animation",
      class: "animated",
      style: {
        strokeWidth: 2,
        transition: "all 250ms ease"
      }
    };

    edgesRef.value.push(newEdge);
    commitEdges();
  }

  function removeNode(nodeId: string) {
    // Remove node from any containers
    nodesRef.value.forEach(node => {
      if (node.data?.isContainer && node.data.children?.includes(nodeId)) {
        removeChildFromContainer(node.id, nodeId);
      }
    });

    nodesRef.value = nodesRef.value.filter(node => node.id !== nodeId);
    edgesRef.value = edgesRef.value.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    );
    commitNodes();
    commitEdges();
  }

  function removeEdge(edgeId: string) {
    edgesRef.value = edgesRef.value.filter(edge => edge.id !== edgeId);
    commitEdges();
  }

  function updateNodePosition(
    nodeId: string,
    position: { x: number; y: number }
  ) {
    const node = nodesRef.value.find(n => n.id === nodeId);
    if (node) {
      node.position = position;
      commitNodes();
    }
  }

  function undo() {
    console.log("undo");
    undoNodes();
    undoEdges();
  }
  /**
   * 重做操作，恢复到历史记录中的下一个状态
   * 此函数会调用 redoNodes 和 redoEdges 来分别重做节点和边的操作
   */
  function redo() {
    console.log("redo");
    redoNodes();
    redoEdges();
  }

  let undo_redo_keyboard_event = () =>
    onKeyDown(true, e => {
      // if (!ref_history.value) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          console.log("undo");
          undo();
          // ref_history.value.undo();
        } else if (e.key === "x" && !e.shiftKey) {
          console.log("redo");
          redo();

          // ref_history.value.redo();
        }
      }
    });
  undo_redo_keyboard_event();
  function getNodeDataById(id: string) {
    return nodesRef.value.find((item: any) => item.id === id);
  }
  // function setup_undo_redo() {
  //   // ref_history.value = useManualRefHistory(history, { clone: true });
  //   undo_redo_keyboard_event();
  // }
  // saveState();

  return {
    nodes: nodesRef,
    edges: edgesRef,
    nodeTypes,
    addNode,
    onConnect,
    removeNode,
    removeEdge,
    updateNodePosition,
    updateNodeDimensions,
    getNodeDataByType,
    addChildToContainer,
    removeChildFromContainer,
    undo,
    redo,
    getNodeDataById,
    setParentNode
  };
});
