---
slug: cloud-resume-multi-cloud
title: "My Cloud Resume Challenge: Building Serverless Application on AWS and Azure"
excerpt: "A dual-platform strategy for comparative learning, building the same serverless system on both AWS and Azure to understand how two cloud giants solve the same problems."
author: "Faza Billah"
publishedDate: "Jan 2026"
readTime: "8 min read"
tags:
  - Cloud Engineer
  - AWS
  - Azure
  - Serverless
coverImage: null
---

## 1. Introduction: Zero to... Two Clouds?

Starting from zero, my goal wasn't just to learn theory but to build practical, in-demand skills that could be immediately applied. The "Cloud Resume Challenge" presented itself as a framework for this, offering a structured path to building a complete serverless application. I decided to add a personal twist: instead of choosing one cloud provider, I would build the entire system simultaneously on both AWS and Azure. This method designed for comparative learning, allowing me to see exactly how two of the biggest players in the cloud space approach and solve the same set of problems, service by service. This project was never about just hosting a simple static resume; the scope was to engineer and deploy a full-stack, automated system on two parallel cloud infrastructures.

## 2. The Real Goal: It's a System, Not Just a Site

The value of this project isn't in hosting a few HTML and CSS files. it's in building a complete, dynamic, serverless application. A static site is simple, but a system requires a backend, a database, and automation. This challenge pushes me to assemble these moving parts into a cohesive whole, which is where the learning happens. The key components that elevate this project from a webpage to a full-fledged system include:

- **A real database:** The system uses NoSQL databases. Amazon DynamoDB on the AWS side and Azure CosmosDB on the Azure side to store and retrieve dynamic data, such as a live visitor counter displayed on the resume.
- **An API layer:** To connect the frontend website to the database, a serverless API layer was built. This consists of an API Gateway that routes requests to a compute function (AWS Lambda or Azure Functions) which, in turn, interacts with the database. This provides a secure and scalable backend endpoint for the frontend to call.
- **Automation:** A professional cloud setup relies heavily on automation. This project incorporates Infrastructure as Code (IaC) to define and manage cloud resources programmatically (using AWS CloudFormation and Terraform) and a CI/CD pipeline (using GitHub Actions) to automate testing and deployment for both cloud environments.

## 3. The High-Level Map: A Side-by-Side Look at AWS vs. Azure

The Multi-Cloud architecture provides a practical, side-by-side comparison of how AWS and Azure handle the fundamental layers of a modern web application. By breaking down the architecture into its core functional layers, I can see a direct translation of services and concepts between the two ecosystems.

### 3.1 The Front Door: DNS

This layer translates a human readable domain name (like example.com) into a machine-readable IP address that a browser can use to locate the server.

- **AWS:** Route 53 (fazabillah.com)
- **Azure:** Cloudflare (fazabillah.my)

### 3.2 Content Delivery: CDN & Static Storage

This layer is responsible for storing the static website files (HTML, CSS, JavaScript) and using a Content Delivery Network (CDN) to distribute them globally for faster load times. In the Azure stack, Azure Storage holds the files, Azure CDN distributes them, and Cloudflare provides DNS and SSL.

- **AWS:** S3 + CloudFront
- **Azure:** Azure Storage + Azure CDN + Cloudflare

### 3.3 The Brains: API & Compute Logic

This is the serverless backend, which runs application code in response to API requests—such as fetching and updating the visitor count—without the need to provision or manage servers.

- **AWS:** API Gateway + Lambda
- **Azure:** Azure Functions

### 3.4 The Memory: Database

This layer provides the persistent storage for application data. In this case, it's a simple but crucial NoSQL database used to store the site's visitor count.

- **AWS:** DynamoDB
- **Azure:** CosmosDB

With the cloud infrastructure mapped out, the next step is to look at the code and tools used to build, define, and deploy this entire system.

## 4. The Code and Tooling Under the Hood

The cloud services provide the foundation, but the implementation is brought to life through a modern frontend, Infrastructure as Code (IaC) for resource management, and automated deployment pipelines for seamless updates. The choice of IaC tools was tailored to each platform's ecosystem:

- **AWS:** The infrastructure was defined using **AWS CloudFormation** along with the **Serverless Application Model (SAM)**, a framework that simplifies building serverless applications. This was complemented by **Ansible** for configuration management tasks, automating parts of the setup not covered by the IaC templates—a practical approach showing how different tools can solve different automation problems.
- **Azure:** For the Azure stack, **Terraform** was used. Its provider ecosystem makes it a powerful choice for managing resources in a multi-cloud or platform-agnostic way.

The frontend is **React 19 Single-Page Application (SPA)** built with **Vite**. It uses **React Router 7** for navigation and is styled with **Bootstrap 4.5**, creating a responsive and structured user interface.

Connecting everything together is **GitHub Actions**, which serves as the single, unifying CI/CD tool. It automates the entire deployment process for both the AWS and Azure environments, ensuring that any changes to the code or infrastructure are deployed consistently and reliably.

## 5. Final Thoughts: Was Building Two Clouds Worth It?

So, was tackling two cloud platforms from a standing start worth the extra effort? Absolutely. The Multi-Cloud approach was an incredible learning experience. Instead of just learning *how* to do something on AWS, I was forced to understand *why* I was doing it, as I had to immediately translate that concept to its Azure equivalent. It solidifies core cloud principles far more effectively than sticking to a single ecosystem.

The single most important lesson from this comparative build is that while the service names and implementation details differ, the fundamental architectural patterns; DNS, CDN, serverless compute, NoSQL databases are universal. Learning them this way provides a robust, provider-agnostic understanding of modern cloud infrastructure.

It's challenging, but the clarity you gain is invaluable. And from a practical standpoint, it's affordable. Here is the final annual cost breakdown for the project:

- **AWS Cost:** ~$6/year (due to the $0.50/mo for a Route 53 hosted zone)
- **Azure Cost:** ~$5/year (leveraging the free tier)
- **Domain:** ~$12/year
