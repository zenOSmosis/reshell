import { useCallback, useEffect, useState } from "react";
import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";

const MemoryInfo = {
  id: "memory-info",
  title: "Memory Info",
  style: {
    left: "auto",
    bottom: 0,
    width: 640,
    height: 480,
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
        jsHeapSizeLimit,
        totalJSHeapSize,
        usedJSHeapSize,
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
                  <td>{jsHeapSizeLimit}</td>
                  <td>{totalJSHeapSize}</td>
                  <td>{usedJSHeapSize}</td>
                </tr>
              </tbody>
            </table>
          </Center>
        </Content>
        <Footer>
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
