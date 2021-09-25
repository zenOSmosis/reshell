import { useCallback, useEffect, useState } from "react";
import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";

import bytesToSize from "@utils/bytesToSize";

const MemoryInfo = {
  id: "memory-info",
  title: "Memory Info",
  style: {
    width: 280,
    height: 150,
  },
  view: function View() {
    const [
      { jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize },
      _setMemoryInfo,
    ] = useState({
      jsHeapSizeLimit: "N/A",
      totalJSHeapSize: "N/A",
      usedJSHeapSize: "N/A",
    });

    // TODO: Document
    const fetchMemoryInfo = useCallback(() => {
      if (!window.performance.memory) {
        return;
      }

      // @see https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory
      const { jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize } =
        window.performance.memory;

      const memoryInfo = {
        jsHeapSizeLimit: bytesToSize(jsHeapSizeLimit),
        totalJSHeapSize: bytesToSize(totalJSHeapSize),
        usedJSHeapSize: bytesToSize(usedJSHeapSize),
      };

      _setMemoryInfo(memoryInfo);

      return memoryInfo;
    }, []);

    // Automatically refresh heap
    useEffect(() => {
      const initialFetch = fetchMemoryInfo();

      if (initialFetch) {
        const refetchInterval = setInterval(() => {
          fetchMemoryInfo();
        }, 1000);

        return function unmount() {
          clearInterval(refetchInterval);
        };
      }
    }, [fetchMemoryInfo]);

    // TODO: Incorporate graphing library

    return (
      <Layout style={{ backgroundColor: "#424242", color: "#999" }}>
        <Content>
          <Center>
            <table style={{ display: "inline-block" }}>
              <thead>
                <tr>
                  <td>Heap Size Limit</td>
                  <td>Total Heap Size</td>
                  <td>Used Heap Size</td>
                </tr>
              </thead>

              <tbody>
                <tr>
                  {
                    // TODO: Render as formatted strings (i.e. "... GB")
                  }
                  <td>{jsHeapSizeLimit}</td>
                  <td>{totalJSHeapSize}</td>
                  <td>{usedJSHeapSize}</td>
                </tr>
              </tbody>
            </table>
          </Center>
        </Content>
        <Footer style={{ fontSize: ".8rem" }}>
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory"
            target="_blank"
            rel="noreferrer"
            style={{ float: "left" }}
          >
            MDN Documentation
          </a>
          <span style={{ float: "right" }}>
            Only supported in Chromium-based browsers.
          </span>
        </Footer>
      </Layout>
    );
  },
};

export default MemoryInfo;
