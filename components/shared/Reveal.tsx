"use client";

import { motion } from "motion/react";
import React from "react";

const Reveal = ({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;



/**
 * Reusable scroll-triggered reveal animation component.
 * Fades in and slides content upward when it enters the viewport.
 * Supports customizable delay and CSS classes.
 */